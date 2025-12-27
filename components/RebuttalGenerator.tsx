
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const RebuttalGenerator: React.FC = () => {
  const [opponentText, setOpponentText] = useState('');
  const [rebuttal, setRebuttal] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const generateRebuttal = async () => {
    if (!opponentText) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        أنت محامٍ مغربي خبير في المساطر القضائية. قم بتحليل مقتطفات من مذكرة الخصم التالية:
        "${opponentText}"
        
        المطلوب:
        1. تحديد نقط الضعف والادعاءات غير المسندة قانونياً.
        2. اقتراح "دفوع شكلية" (الدفع بعدم الاختصاص، الدفع بالبطلان، إلخ) إذا كان ذلك ممكناً.
        3. صياغة "مذكرة تعقيبية" (Note en réplique) تفند هذه الادعاءات موضوعياً.
        4. الاستشهاد بفصول قانون الالتزامات والعقود أو قانون المسطرة المدنية المغربي ذات الصلة.
        
        الصياغة بلغة عربية قانونية رصينة ومحكمة.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });

      setRebuttal(response.text || 'لم يتمكن النظام من صياغة الرد.');
    } catch (error) {
      console.error(error);
      setRebuttal('حدث خطأ أثناء الاتصال بمحرك الاستدلال القانوني.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-right" dir="rtl">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden relative">
        <header className="flex items-center gap-5 mb-10">
          <div className="w-16 h-16 bg-rose-900 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-2">
            <i className="fa-solid fa-shield-halved text-2xl text-rose-400"></i>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-800">مفند ادعاءات الخصم</h3>
            <p className="text-[10px] text-rose-600 font-bold uppercase tracking-widest mt-1">تحليل مذكرات الطرف الآخر وصياغة التعقيبات</p>
          </div>
        </header>

        <div className="space-y-6">
          <label className="block text-xs font-black text-slate-400 mb-3 pr-2 uppercase">قم بلصق محتوى مذكرة الخصم أو النقاط المراد الرد عليها</label>
          <textarea 
            className="w-full h-48 bg-slate-50 border-2 border-slate-100 rounded-[2rem] p-8 text-sm font-medium focus:ring-4 focus:ring-rose-50 outline-none transition-all resize-none shadow-inner"
            placeholder="مثال: يدعي الخصم أن العقد باطل لعدم توفر الرضا، وحيث أنه يزعم أيضاً..."
            value={opponentText}
            onChange={(e) => setOpponentText(e.target.value)}
          ></textarea>

          <button 
            onClick={generateRebuttal}
            disabled={loading || !opponentText}
            className="w-full bg-rose-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-rose-700 shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-4"
          >
            {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-gavel"></i>}
            {loading ? 'جاري تحليل ادعاءات الخصم...' : 'توليد المذكرة التعقيبية'}
          </button>
        </div>

        {rebuttal && (
          <div className="mt-12 p-8 bg-slate-900 text-slate-100 rounded-[2.5rem] border border-slate-800 animate-in fade-in slide-in-from-bottom-5 duration-700">
             <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                <i className="fa-solid fa-pen-nib text-rose-400"></i>
                <h4 className="font-black m-0 text-sm">مسودة الرد القانوني (التعقيب):</h4>
             </div>
             <div className="prose prose-invert max-w-none whitespace-pre-wrap text-sm leading-loose font-medium opacity-90">
                {rebuttal}
             </div>
             <div className="mt-8 pt-6 border-t border-white/5">
                <button 
                  onClick={() => {navigator.clipboard.writeText(rebuttal); alert('تم نسخ المذكرة');}}
                  className="bg-white/10 px-6 py-2 rounded-xl text-[10px] font-black hover:bg-white/20 transition-all flex items-center gap-2"
                >
                  <i className="fa-solid fa-copy"></i> نسخ النص للتعديل
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RebuttalGenerator;
