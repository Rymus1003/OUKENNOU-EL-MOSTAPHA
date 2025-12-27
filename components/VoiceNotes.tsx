
import React, { useState, useRef, useEffect } from 'react';
import { api } from '../api';
import { GoogleGenAI } from "@google/genai";

const VoiceNotes: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        processVoiceNote(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("يرجى تفعيل صلاحية الميكروفون للتسجيل.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const processVoiceNote = async (audioBlob: Blob) => {
    setLoading(true);
    setTranscription('');
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: [
            {
              inlineData: {
                data: base64Data,
                mimeType: 'audio/webm'
              }
            },
            {
              text: "قم بتفريغ هذا التسجيل الصوتي الخاص بمحامٍ مغربي وتحويله إلى نص ملخص ومرتب. إذا ذكر المحامي أرقام ملفات أو مواعيد أو أسماء موكلين، قم بإبرازها في نقاط واضحة. تحدث باللغة العربية بأسلوب مهني."
            }
          ]
        });

        setTranscription(response.text || 'لم يتمكن الذكاء الاصطناعي من فهم التسجيل.');
      };
    } catch (error) {
      console.error(error);
      setTranscription('حدث خطأ أثناء معالجة الصوت.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-right" dir="rtl">
      <div className="bg-slate-900 rounded-[3rem] p-12 shadow-2xl border border-slate-800 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/10 via-transparent to-rose-500/10 opacity-30"></div>
        
        <header className="text-center mb-12 relative z-10">
          <h3 className="text-3xl font-black mb-4 flex items-center justify-center gap-4">
            <i className="fa-solid fa-microphone-lines text-indigo-400"></i>
            المذكرات الصوتية الذكية
          </h3>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">سجل ملاحظاتك فوراً بعد الجلسة واترك التلخيص للذكاء الاصطناعي</p>
        </header>

        <div className="flex flex-col items-center gap-8 relative z-10">
          <div className="relative">
            {isRecording && (
              <div className="absolute inset-0 bg-rose-500 rounded-full animate-ping opacity-20 scale-150"></div>
            )}
            <button 
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-32 h-32 rounded-full flex items-center justify-center text-4xl shadow-2xl transition-all transform active:scale-95 ${isRecording ? 'bg-rose-600 hover:bg-rose-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              <i className={`fa-solid ${isRecording ? 'fa-stop' : 'fa-microphone'}`}></i>
            </button>
          </div>

          <p className="text-slate-300 font-medium h-6">
            {isRecording ? 'جاري الاستماع... اضغط للتوقف' : 'اضغط على الميكروفون لبدء التسجيل'}
          </p>

          {(loading || transcription) && (
            <div className="w-full bg-white/5 rounded-3xl p-8 border border-white/10 mt-8 animate-in slide-in-from-bottom-5 duration-500">
               <h4 className="text-indigo-400 text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                 <i className="fa-solid fa-wand-sparkles"></i>
                 التفريغ والتلخيص الذكي
               </h4>
               {loading ? (
                 <div className="flex flex-col items-center gap-4 py-8">
                    <i className="fa-solid fa-spinner fa-spin text-3xl text-indigo-500"></i>
                    <p className="text-xs font-bold text-slate-500">جاري تحليل النبرات الصوتية واستخراج الملاحظات...</p>
                 </div>
               ) : (
                 <div className="prose prose-invert max-w-none whitespace-pre-wrap text-slate-300 text-sm leading-loose">
                    {transcription}
                 </div>
               )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><i className="fa-solid fa-file-invoice"></i></div>
            <div>
               <h4 className="font-black text-slate-800 text-sm">أرشفة الملاحظات</h4>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">تحويل الصوت إلى نصوص قابلة للبحث</p>
            </div>
         </div>
         <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center"><i className="fa-solid fa-bolt"></i></div>
            <div>
               <h4 className="font-black text-slate-800 text-sm">توفير الوقت</h4>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">لا حاجة للكتابة اليدوية بعد الآن</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default VoiceNotes;
