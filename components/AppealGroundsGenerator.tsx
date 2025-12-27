
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const AppealGroundsGenerator: React.FC = () => {
  const [judgmentText, setJudgmentText] = useState('');
  const [grounds, setGrounds] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const generateGrounds = async () => {
    if (!judgmentText) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        بصفتك محامياً خبيراً في محاكم الاستئناف المغربية، قم بتحليل منطوق الحكم (Le dispositif) والحيثيات التالية:
        "${judgmentText}"
        
        المطلوب:
        1. استخراج أهم الثغرات القانونية أو المسطرية (فادحة القانون، انعدام التعليل، خرق حقوق الدفاع).
        2. صياغة 3 إلى 5 "أسباب استئناف" (Moyens d'appel) قوية ورصينة.
        3. الإشارة إلى المواد القانونية من قانون المسطرة المدنية أو الجنائية المغربي ذات الصلة.
        4. تقديم نصيحة استراتيجية حول "طلب إيقاف التنفيذ" إذا كان الحكم مشمولاً بالنفاذ المعجل.
        
        تحدث باللغة العربية القانونية الرصينة.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });

      setGrounds(response.text || 'لم يتمكن النظام من توليد أسباب الطعن.');
    } catch (error) {
      console.error(error);
      setGrounds('حدث خطأ أثناء الاتصال بالمساعد الذكي.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-right" dir="rtl">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
        <header className="flex items-center gap-5 mb-10">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-2">
            <i className="fa-solid fa-scale-unbalanced text-2xl text-rose-400"></i>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-800">مخطط استراتيجية الاستئناف</h3>
            <p className="text-[10px] text-rose-600 font-bold uppercase tracking-widest mt-1">توليد أسباب الطعن بناءً على الحيثيات القانونية</p>
          </div>
        </header>

        <div className="space-y-6">
          <label className="block text-xs font-black text-slate-400 mb-3 pr-2 uppercase">قم بلصق حيثيات أو منطوق الحكم الابتدائي</label>
          <textarea 
            className="w-full h-48 bg-slate-50 border-2 border-slate-100 rounded-[2rem] p-8 text-sm font-medium focus:ring-4 focus:ring-rose-50 outline-none transition-all resize-none shadow-inner"
            placeholder="مثال: بناءً على المادة... وحيث أن المحكمة لم تراعِ... حكمت علنياً وابتدائياً بـ..."
            value={judgmentText}
            onChange={(e) => setJudgmentText(e.target.value)}
          ></textarea>

          <button 
            onClick={generateGrounds}
            disabled={loading || !judgmentText}
            className="w-full bg-rose-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-rose-700 shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-4"
          >
            {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-gavel"></i>}
            {loading ? 'جاري استنباط الثغرات القانونية...' : 'توليد أسباب الطعن بالاستئناف'}
          </button>
        </div>

        {grounds && (
          <div className="mt-12 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-200 animate-in fade-in slide-in-from-bottom-5 duration-700">
             <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
                <i className="fa-solid fa-file-contract text-rose-500"></i>
                <h4 className="font-black text-slate-800 m-0">مسودة مذكرة أسباب الاستئناف:</h4>
             </div>
             <div className="prose prose-slate max-w-none whitespace-pre-wrap text-sm leading-loose font-medium text-slate-700 italic">
                {grounds}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppealGroundsGenerator;
