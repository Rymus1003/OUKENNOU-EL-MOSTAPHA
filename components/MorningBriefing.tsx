
import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { GoogleGenAI } from "@google/genai";

const MorningBriefing: React.FC = () => {
  const [brief, setBrief] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const generateBriefing = async () => {
    setLoading(true);
    try {
      const [stats, hearings, tasks] = await Promise.all([
        api.getStats(),
        api.getAudiences(),
        api.getTasks()
      ]);

      const today = new Date().toISOString().split('T')[0];
      const todayHearings = hearings.filter((h: any) => h.date_audience.split('T')[0] === today);
      const pendingTasks = tasks.filter((t: any) => t.status === 'pending');

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        أنت مدير مكتب محاماة مغربي ذكي. قم بإعداد "موجز صباحي" سريع ومركّز للأستاذ بناءً على المعطيات التالية لليوم (${today}):
        
        1. الجلسات المبرمجة لليوم: ${todayHearings.length > 0 ? todayHearings.map(h => `${h.titre_affaire} في ${h.tribunal}`).join('، ') : 'لا توجد جلسات مبرمجة.'}
        2. المهام العالقة: ${pendingTasks.length} مهام.
        3. الوضعية المالية: هناك ${stats.total_pending_fees} درهم مستحقات غير محصلة.
        
        المطلوب:
        - تقديم 3 أولويات قصوى لليوم.
        - نصيحة سريعة لرفع كفاءة التحصيل أو إدارة الوقت.
        - عبارة تحفيزية مهنية.
        - اللغة: عربية رصينة ومختصرة جداً (قراءة في أقل من دقيقة).
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setBrief(response.text || 'تعذر توليد الموجز.');
    } catch (error) {
      setBrief('حدث خطأ أثناء إعداد موجزك الصباحي.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto text-right" dir="rtl">
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="space-y-4">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10 shadow-xl">
                    <i className="fa-solid fa-sun-bright text-amber-400 text-xl"></i>
                 </div>
                 <h3 className="text-2xl font-black">الموجز الصباحي الذكي</h3>
              </div>
              <p className="text-indigo-200/70 text-sm font-medium max-w-md">احصل على رؤية استراتيجية لأجندة عملك اليومية بلمحة واحدة.</p>
           </div>
           
           <button 
             onClick={generateBriefing}
             disabled={loading}
             className="bg-white text-indigo-900 px-8 py-4 rounded-2xl font-black text-sm shadow-xl hover:bg-indigo-50 transition-all flex items-center gap-3 shrink-0"
           >
             {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-bolt-lightning text-indigo-600"></i>}
             {loading ? 'جاري التحليل...' : 'توليد خطة اليوم'}
           </button>
        </div>

        {brief && (
          <div className="mt-10 p-8 bg-white/5 rounded-[2.5rem] border border-white/10 animate-in fade-in slide-in-from-top-4 duration-700">
             <div className="prose prose-invert max-w-none whitespace-pre-wrap text-sm leading-loose font-medium text-indigo-50 italic">
                {brief}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MorningBriefing;
