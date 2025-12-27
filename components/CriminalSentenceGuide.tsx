
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const CriminalSentenceGuide: React.FC = () => {
  const [offense, setOffense] = useState('');
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const analyzeOffense = async () => {
    if (!offense) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        أنت مستشار جنائي مغربي. قم بتحليل الفعل الجرمي التالي وفق القانون الجنائي المغربي:
        "${offense}"
        
        المطلوب:
        1. التكييف القانوني المقترح (جناية، جنحة ضبطية، جنحة تأديبية).
        2. العقوبة الأصلية المقررة في القانون (الحد الأدنى والأقصى).
        3. ظروف التشديد المحتملة (العود، الليل، التعدد...).
        4. ظروف التخفيف التي يمكن للمحامي الدفع بها (المادة 146 وما بعدها).
        5. مراجع الفصول القانونية المرتبطة.
        
        النتيجة باللغة العربية.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });

      setAnalysis(response.text || 'تعذر تحليل الجريمة.');
    } catch (error) {
      setAnalysis('خطأ في الاتصال بقاعدة البيانات الجنائية الذكية.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-right" dir="rtl">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-48 h-48 bg-rose-50 rounded-full blur-3xl -mr-24 -mt-24 opacity-50"></div>
        
        <header className="flex items-center gap-5 mb-10 relative z-10">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <i className="fa-solid fa-handcuffs text-2xl text-rose-500"></i>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-800">مساعد القضاء الجنائي</h3>
            <p className="text-[10px] text-rose-600 font-bold uppercase tracking-widest mt-1">تكييف الجرائم وتقدير العقوبات - القانون الجنائي المغربي</p>
          </div>
        </header>

        <div className="space-y-6 relative z-10">
          <input 
            type="text" 
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-lg font-bold focus:ring-4 focus:ring-rose-50 outline-none transition-all"
            placeholder="اشرح الفعل الجرمي (مثال: سرقة موصوفة بتعدد الجناة)..."
            value={offense}
            onChange={(e) => setOffense(e.target.value)}
          />

          <button 
            onClick={analyzeOffense}
            disabled={loading || !offense}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xl hover:bg-black shadow-xl transition-all flex items-center justify-center gap-4"
          >
            {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-magnifying-glass-chart"></i>}
            {loading ? 'جاري التحليل الجنائي...' : 'تكييف الفعل وحساب العقوبة'}
          </button>
        </div>

        {analysis && (
          <div className="mt-12 p-8 bg-slate-900 text-white rounded-[2.5rem] border border-slate-800 animate-in fade-in slide-in-from-bottom-5 duration-700">
             <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                <i className="fa-solid fa-shield-halved text-rose-400"></i>
                <h4 className="font-black m-0 text-sm">التكييف والتقدير القانوني:</h4>
             </div>
             <div className="prose prose-invert max-w-none whitespace-pre-wrap text-sm leading-relaxed font-medium text-slate-300">
                {analysis}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CriminalSentenceGuide;
