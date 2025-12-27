
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';

const StrategyRoom: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcription, setTranscription] = useState<string[]>([]);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Manual base64 encoding
  const encode = (bytes: Uint8Array) => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  // Manual base64 decoding
  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  // Decode PCM data manually
  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  // Create PCM blob for input
  const createBlob = (data: Float32Array) => {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    return {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
  };

  const startSession = async () => {
    setIsConnecting(true);
    setTranscription([]);
    try {
      // Use named parameter for apiKey
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setIsActive(true);
            const source = inputCtx.createMediaStreamSource(streamRef.current!);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              // Send data only after session promise resolves
              sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message) => {
            // Process audio bytes from modelTurn
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && audioContextRef.current) {
              const audioBuffer = await decodeAudioData(decode(base64Audio), audioContextRef.current, 24000, 1);
              const source = audioContextRef.current.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(audioContextRef.current.destination);
              
              // Schedule gapless playback
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioContextRef.current.currentTime);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }

            // Handle server interruptions
            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }

            // Transcription support
            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              if (text) {
                setTranscription(prev => [...prev, `المساعد: ${text}`]);
              }
            }
          },
          onclose: () => stopSession(),
          onerror: (e) => console.error('Live API Error:', e)
        },
        config: {
          // One modality: AUDIO
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          outputAudioTranscription: {}, // Enable audio transcription
          systemInstruction: 'أنت مساعد قانوني صوتي لمكتب محاماة مغربي. دورك هو محاورة المحامي صوتياً لمساعدته في بناء الحجج، مراجعة نقاط القوة والضعف في القضية، والتحضير للمرافعات الشفهية بناءً على القانون المغربي. تحدث برصانة قانونية وباللغة العربية.',
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (error) {
      console.error(error);
      setIsConnecting(false);
    }
  };

  const stopSession = () => {
    // Explicitly close the session to release resources
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsActive(false);
    setIsConnecting(false);
  };

  useEffect(() => {
    return () => stopSession();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-right" dir="rtl">
      <div className="bg-slate-900 rounded-[3rem] p-12 shadow-2xl border border-slate-800 relative overflow-hidden text-white min-h-[600px] flex flex-col items-center justify-center">
        {/* Background Visuals */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500 rounded-full blur-[120px]"></div>
        </div>

        <header className="absolute top-12 text-center w-full px-12">
           <h3 className="text-3xl font-black mb-2 flex items-center justify-center gap-4">
              <i className="fa-solid fa-microphone-lines text-indigo-400"></i>
              غرفة الاستراتيجية الصوتية
           </h3>
           <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.3em]">AI-Powered Legal Brainstorming</p>
        </header>

        <div className="relative z-10 flex flex-col items-center gap-12 w-full max-w-lg">
           {/* Visual Pulse */}
           <div className={`relative w-48 h-48 rounded-full flex items-center justify-center transition-all duration-700 ${isActive ? 'scale-110' : 'scale-100'}`}>
              <div className={`absolute inset-0 rounded-full bg-indigo-500/20 ${isActive ? 'animate-ping' : ''}`}></div>
              <div className={`absolute inset-4 rounded-full bg-indigo-500/30 ${isActive ? 'animate-pulse' : ''}`}></div>
              <div className="absolute inset-8 rounded-full bg-slate-800 border-4 border-indigo-600 flex items-center justify-center shadow-2xl">
                 <i className={`fa-solid ${isActive ? 'fa-waveform-lines' : 'fa-microphone'} text-5xl text-indigo-400`}></i>
              </div>
           </div>

           <div className="text-center space-y-6 w-full">
              <p className="text-slate-300 text-lg font-medium leading-relaxed italic">
                 {isConnecting ? 'جاري الاتصال بالقمر الاصطناعي القانوني...' : 
                  isActive ? 'المساعد القانوني يستمع إليك الآن... تفضل بمناقشة قضيتك.' : 
                  'اضغط للبدء في جلسة تحضيرية صوتية ذكية للمرافعة'}
              </p>

              {!isActive ? (
                <button 
                  onClick={startSession}
                  disabled={isConnecting}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-12 py-5 rounded-3xl font-black text-xl shadow-2xl shadow-indigo-900/40 transition-all transform active:scale-95 flex items-center justify-center gap-4 mx-auto"
                >
                  {isConnecting ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-play"></i>}
                  دخول غرفة الاستراتيجية
                </button>
              ) : (
                <button 
                  onClick={stopSession}
                  className="bg-rose-600 hover:bg-rose-500 text-white px-12 py-5 rounded-3xl font-black text-xl shadow-2xl shadow-rose-900/40 transition-all transform active:scale-95 flex items-center justify-center gap-4 mx-auto"
                >
                  <i className="fa-solid fa-stop"></i>
                  إنهاء الجلسة الصوتية
                </button>
              )}
           </div>
        </div>

        {/* Real-time Insights Visual Feedback */}
        {isActive && (
          <div className="absolute bottom-12 left-12 right-12 max-h-32 overflow-y-auto scrollbar-hide text-center px-8">
             <div className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-2">تنبيهات الاستماع النشط</div>
             <p className="text-sm text-slate-400 font-bold animate-pulse">يتم الآن تحليل حججك القانونية لتزويدك بردود فورية...</p>
             <div className="mt-2 text-xs text-indigo-200 opacity-60">
               {transcription.length > 0 && transcription[transcription.length - 1]}
             </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center"><i className="fa-solid fa-shield-halved"></i></div>
            <div>
               <h4 className="font-black text-slate-800 text-sm">سرية تامة</h4>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">المحادثات مشفرة ولا يتم تخزينها</p>
            </div>
         </div>
         <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center"><i className="fa-solid fa-brain"></i></div>
            <div>
               <h4 className="font-black text-slate-800 text-sm">ذكاء متخصص</h4>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">مدرب على الاجتهادات القضائية المغربية</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default StrategyRoom;
