
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const ContractAnalyzer: React.FC = () => {
  const [contractText, setContractText] = useState('');
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const analyzeContract = async () => {
    if (!contractText) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        أنت مستشار قانوني مغربي خبير. قم بتحليل العقد التالي بناءً على قانون الالتزامات والعقود (DOC) والتشريعات المغربية ذات الصلة.
        1. استخرج الأطراف والالتزامات الرئيسية.
        2. حدد أي بنود قد تعتبر تعسفية أو مخالفة للنظام العام المغربي.
        3. قدم توصيات لتحسين صياغة العقد لضمان حماية الموكل.
        4. اذكر المواد القانونية المرتبطة (مثل الفصل 230 من ق.ل.ع حول القوة الملزمة للعقد).
        
        النص:
        ${contractText}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });

      setAnalysis(response.text || 'لم يتمكن النظام من تحليل العقد.');
    } catch (error) {
      console.error(error);
      setAnalysis('حدث خطأ أثناء التحليل الذكي للعقد.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-right" dir="rtl">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-32 -mt-32"></div>
        
        <header className="flex items-center gap-5 mb-10 relative z-10">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-2">
            <i className="fa-solid fa-file-shield text-2xl text-indigo-400"></i>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-800">محلل العقود المغربي</h3>
            <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest mt-1">تدقيق قانوني ذكي بناءً على قانون الالتزامات والعقود</p>
          </div>
        </header>

        <div className="space-y-6 relative z-10">
          <textarea 
            className="w-full h-64 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] p-8 text-sm font-medium focus:ring-4 focus:ring-indigo-50 outline-none transition-all resize-none shadow-inner"
            placeholder="قم بلصق نص العقد هنا للبدء في الفحص القانوني..."
            value={contractText}
            onChange={(e) => setContractText(e.target.value)}
          ></textarea>

          <button 
            onClick={analyzeContract}
            disabled={loading || !contractText}
            className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-indigo-700 shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-4"
          >
            {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-magnifying-glass-chart"></i>}
            {loading ? 'جاري فحص البنود والالتزامات...' : 'بدء الفحص والتدقيق القانوني'}
          </button>
        </div>

        {analysis && (
          <div className="mt-12 p-8 bg-slate-900 text-slate-100 rounded-[2.5rem] border border-slate-800 animate-in fade-in slide-in-from-bottom-5 duration-700">
             <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                <i className="fa-solid fa-microchip text-indigo-400"></i>
                <h4 className="font-black m-0 text-sm">التقرير التحليلي للعقد:</h4>
             </div>
             <div className="prose prose-invert max-w-none whitespace-pre-wrap text-xs leading-loose font-medium opacity-90">
                {analysis}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractAnalyzer;
