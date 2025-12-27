
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const JudicialExpertiseAnalyzer: React.FC = () => {
  const [reportSummary, setReportSummary] = useState('');
  const [critique, setCritique] = useState('');
  const [loading, setLoading] = useState(false);

  const analyzeExpertise = async () => {
    if (!reportSummary) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        أنت مستشار قانوني وفني خبير في المحاكم المغربية. قم بتحليل ملخص تقرير الخبرة القضائية التالي:
        "${reportSummary}"
        
        المطلوب:
        1. تحديد أي تناقضات منطقية في استنتاجات الخبير.
        2. ذكر النقط التي أغفلها الخبير (Omissions).
        3. صياغة "مذكرة مستنتجات" للطعن في الخبرة والمطالبة بخبرة مضادة (Contre-expertise).
        4. الإشارة إلى خرق مقتضيات الفصول 59 إلى 66 من قانون المسطرة المدنية إذا كان هناك خلل مسطري.
        
        تحدث بالعربية القانونية الفصحى.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });

      setCritique(response.text || 'لم يتمكن النظام من تحليل التقرير.');
    } catch (error) {
      setCritique('خطأ في تحليل الخبرة.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-right" dir="rtl">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden relative">
        <header className="flex items-center gap-5 mb-10">
          <div className="w-16 h-16 bg-rose-600 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-2">
            <i className="fa-solid fa-microscope text-2xl"></i>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-800">محلل تقارير الخبرة القضائية</h3>
            <p className="text-[10px] text-rose-600 font-bold uppercase tracking-widest mt-1">نقد فني وقانوني لاستنتاجات الخبراء</p>
          </div>
        </header>

        <div className="space-y-6">
          <label className="block text-xs font-black text-slate-400 mb-2 pr-2">انسخ استنتاجات الخبير أو ملخص التقرير</label>
          <textarea 
            className="w-full h-48 bg-slate-50 border-2 border-slate-100 rounded-3xl p-6 text-sm focus:ring-4 focus:ring-rose-50 outline-none transition-all resize-none shadow-inner"
            placeholder="مثال: خلص الخبير إلى أن نسبة العجز هي... دون مراعاة أن الضحية تعاني من..."
            value={reportSummary}
            onChange={e => setReportSummary(e.target.value)}
          ></textarea>

          <button 
            onClick={analyzeExpertise}
            disabled={loading || !reportSummary}
            className="w-full bg-rose-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-rose-700 shadow-xl transition-all flex items-center justify-center gap-4"
          >
            {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-magnifying-glass-plus"></i>}
            {loading ? 'جاري نقد التقرير...' : 'استخراج ثغرات التقرير والطعن فيه'}
          </button>
        </div>

        {critique && (
          <div className="mt-12 p-8 bg-slate-900 text-rose-50 rounded-[2.5rem] border border-rose-900/50 animate-in fade-in slide-in-from-bottom-5 duration-700">
             <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                <i className="fa-solid fa-shield-halved text-rose-400"></i>
                <h4 className="font-black m-0 text-sm">مذكرة الطعن في الخبرة (AI Critique):</h4>
             </div>
             <div className="prose prose-invert max-w-none whitespace-pre-wrap text-sm leading-loose font-medium opacity-90">
                {critique}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JudicialExpertiseAnalyzer;
