
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const InheritanceSim: React.FC = () => {
  const [heirs, setHeirs] = useState('');
  const [estate, setEstate] = useState<string>('');
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const simulateInheritance = async () => {
    if (!heirs) return;
    setLoading(true);
    setAnalysis('');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        أنت خبير في قانون المواريث المغربي (المذهب المالكي كما هو معتمد في مدونة الأسرة).
        توفي شخص وترك الورثة التاليين: ${heirs}
        قيمة التركة الإجمالية: ${estate || 'غير محددة'} د.م
        
        قم بتوزيع الإرث شرعاً مع شرح نصيب كل وارث (بالفرض أو التعصيب) وكيفية أصل المسألة.
        إذا كان هناك حجب، يرجى توضيحه. صغ النتيجة بأسلوب فقهي وقانوني رصين وباللغة العربية.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });

      setAnalysis(response.text || 'لم يتمكن النظام من تحليل المسألة.');
    } catch (error) {
      console.error(error);
      setAnalysis('حدث خطأ أثناء محاكاة قسمة الميراث الذكية.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-right" dir="rtl">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -ml-32 -mt-32"></div>
        
        <header className="flex items-center gap-5 mb-10 relative z-10">
          <div className="w-16 h-16 bg-emerald-700 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-2">
            <i className="fa-solid fa-book-quran text-2xl"></i>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-800">محاكي قسمة الميراث</h3>
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-1">تطبيق قواعد الإرث حسب مدونة الأسرة</p>
          </div>
        </header>

        <div className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-400 uppercase pr-2">قائمة الورثة (مثال: زوجة، ابنان، بنت، أم)</label>
              <input 
                type="text" 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold focus:ring-4 focus:ring-emerald-50 outline-none transition-all"
                placeholder="من هم الورثة؟"
                value={heirs}
                onChange={(e) => setHeirs(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-400 uppercase pr-2">مبلغ التركة (اختياري)</label>
              <input 
                type="number" 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold focus:ring-4 focus:ring-emerald-50 outline-none transition-all"
                placeholder="0.00"
                value={estate}
                onChange={(e) => setEstate(e.target.value)}
              />
            </div>
          </div>

          <button 
            onClick={simulateInheritance}
            disabled={loading || !heirs}
            className="w-full bg-emerald-800 text-white py-5 rounded-2xl font-black text-xl hover:bg-emerald-900 shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-4"
          >
            {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-scale-balanced"></i>}
            {loading ? 'جاري استنباط الأحكام الشرعية...' : 'تحليل وتوزيع التركة'}
          </button>
        </div>

        {analysis && (
          <div className="mt-12 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-200 animate-in fade-in slide-in-from-bottom-5 duration-700">
             <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
                <i className="fa-solid fa-scroll text-emerald-600"></i>
                <h4 className="font-black text-slate-800 m-0">تكييف المسألة الإرثية:</h4>
             </div>
             <div className="prose prose-slate max-w-none whitespace-pre-wrap text-sm leading-loose font-medium text-slate-700">
                {analysis}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InheritanceSim;
