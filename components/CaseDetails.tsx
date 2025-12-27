
import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { GoogleGenAI, Modality } from "@google/genai";

interface CaseDetailsProps {
  dossierId: string;
  onBack: () => void;
}

const CaseDetails: React.FC<CaseDetailsProps> = ({ dossierId, onBack }) => {
  const [dossier, setDossier] = useState<any>(null);
  const [hearings, setHearings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    loadFullData();
  }, [dossierId]);

  const loadFullData = async () => {
    try {
      setLoading(true);
      const [dossiers, allHearings] = await Promise.all([
        api.getDossiers(),
        api.getAudiences()
      ]);
      const current = dossiers.find((d: any) => d.id.toString() === dossierId);
      const filteredHearings = allHearings.filter((h: any) => h.dossier_id.toString() === dossierId)
                                         .sort((a: any, b: any) => new Date(b.date_audience).getTime() - new Date(a.date_audience).getTime());
      setDossier(current);
      setHearings(filteredHearings);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const speakSummary = async () => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    try {
      const summaryText = `ملف رقم ${dossier.numero_mahakim}. موضوع القضية: ${dossier.titre_affaire}. الموكل هو ${dossier.client_name}. المحكمة المختصة هي ${dossier.tribunal}. الحالة المالية: الباقي هو ${dossier.reste} درهم.`;
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `قل بصوت وقور ومحترف: ${summaryText}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
        
        const decode = (base64: string) => {
          const binaryString = atob(base64);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          return bytes;
        };

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

        const audioBuffer = await decodeAudioData(decode(base64Audio), audioCtx, 24000, 1);
        const source = audioCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioCtx.destination);
        source.start();
        source.onended = () => setIsSpeaking(false);
      } else {
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error(error);
      setIsSpeaking(false);
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse font-bold text-slate-400">جاري تحميل الملف...</div>;
  if (!dossier) return <div className="p-20 text-center text-rose-500 font-bold">الملف غير موجود!</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-right" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors">
          <i className="fa-solid fa-arrow-right"></i>
          العودة للقائمة
        </button>
        <button 
          onClick={speakSummary}
          disabled={isSpeaking}
          className="flex items-center gap-3 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs shadow-xl hover:bg-black transition-all disabled:opacity-50"
        >
          {isSpeaking ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-volume-high text-indigo-400"></i>}
          {isSpeaking ? 'جاري توليد الموجز الصوتي...' : 'استماع لموجز الملف'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Info Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                <i className="fa-solid fa-folder-open text-xl"></i>
              </div>
              <div>
                <h3 className="font-black text-slate-800 leading-tight">معلومات الملف</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{dossier.numero_mahakim}</p>
              </div>
            </div>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-400 font-bold">المحكمة:</span>
                <span className="text-slate-700 font-bold">{dossier.tribunal}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-400 font-bold">الموكل:</span>
                <span className="text-indigo-600 font-black">{dossier.client_name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-400 font-bold">الطرف الخصم:</span>
                <span className="text-rose-600 font-bold">{dossier.partie_adverse || '---'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-400 font-bold">النوع:</span>
                <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold">{dossier.type_affaire}</span>
              </div>
            </div>
          </div>

          <div className="bg-rose-600 p-6 rounded-3xl shadow-xl text-white">
            <h4 className="font-black mb-4 flex items-center gap-2">
              <i className="fa-solid fa-wallet"></i>
              الوضعية المالية
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center opacity-80">
                <span className="text-xs">المبلغ الإجمالي</span>
                <span className="font-bold">{Number(dossier.montant_total || 0).toLocaleString()} د.م</span>
              </div>
              <div className="pt-4 border-t border-white/20 flex justify-between items-center">
                <span className="text-sm font-bold">الباقي بذمته</span>
                <span className="text-2xl font-black">{Number(dossier.reste || 0).toLocaleString()} د.م</span>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Content */}
        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 min-h-[500px]">
            <h3 className="font-black text-slate-800 mb-8 flex items-center gap-3">
              <i className="fa-solid fa-timeline text-amber-500"></i>
              الجدول الزمني للجلسات
            </h3>

            {hearings.length === 0 ? (
              <div className="text-center py-20 text-slate-400 italic">لا توجد جلسات مسجلة لهذا الملف.</div>
            ) : (
              <div className="relative border-r-2 border-slate-100 pr-8 space-y-12">
                {hearings.map((h, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -right-[41px] top-0 w-4 h-4 rounded-full bg-white border-4 border-indigo-500 shadow-sm z-10"></div>
                    <div className="bg-slate-50 p-6 rounded-2xl hover:bg-indigo-50 transition-all group">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-indigo-600 font-black text-lg">{new Date(h.date_audience).toLocaleDateString('ar-MA', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                          <p className="text-xs text-slate-400 font-bold mt-1">الساعة: {new Date(h.date_audience).toLocaleTimeString('ar-MA', { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        <span className="bg-white px-3 py-1 rounded-full text-[10px] font-bold text-slate-500 border border-slate-200 shadow-sm">
                          {h.salle || 'قاعة غير محددة'}
                        </span>
                      </div>
                      <div className="bg-white/50 p-4 rounded-xl border border-white">
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">القرار المتخذ / الملاحظات</p>
                         <p className="text-slate-700 leading-relaxed font-medium">{h.decision_intermediaire || h.notes_audience || 'لا توجد ملاحظات مسجلة.'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseDetails;
