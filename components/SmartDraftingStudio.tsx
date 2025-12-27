
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const SmartDraftingStudio: React.FC = () => {
  const [facts, setFacts] = useState('');
  const [grounds, setGrounds] = useState('');
  const [demands, setDemands] = useState('');
  const [style, setStyle] = useState('formal');
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);

  const generateComplexMemo = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        أنت محامٍ مغربي بهيئة الدار البيضاء، خبير في الصياغة القضائية.
        قم بصياغة "مذكرة تفصيلية" بناءً على المعطيات التالية:
        1. الوقائع (Les faits): ${facts}
        2. الأسانيد القانونية (Moyens de droit): ${grounds}
        3. الملتمسات (Conclusions): ${demands}
        
        أسلوب الصياغة المطلوب: ${style === 'aggressive' ? 'هجومي وقوي يفند ادعاءات الخصم بحدة' : style === 'academic' ? 'أكاديمي رصين موجه لمحكمة النقض' : 'رسمي متوازن'}
        
        التزم بالهيكلة المغربية: (من حيث الشكل، من حيث الموضوع، لهاته الأسباب). استخدم لغة قانونية عربية قحة.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });

      setDraft(response.text || 'تعذر توليد المسودة.');
    } catch (error) {
      setDraft('خطأ في معالجة البيانات القانونية.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 text-right" dir="rtl">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
        <header className="flex items-center gap-5 mb-12">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <i className="fa-solid fa-pen-nib text-2xl text-indigo-400"></i>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-800">مختبر الصياغة القانونية المتقدم</h3>
            <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest mt-1">بناء المذكرات والمقالات بهيكلة احترافية</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 pr-2">الوقائع والحيثيات</label>
              <textarea 
                className="w-full h-32 bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 text-sm focus:ring-4 focus:ring-indigo-50 outline-none transition-all resize-none"
                placeholder="اشرح ما حدث في الواقعة..."
                value={facts}
                onChange={e => setFacts(e.target.value)}
              ></textarea>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 pr-2">الأسانيد والوسائل القانونية</label>
              <textarea 
                className="w-full h-32 bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 text-sm focus:ring-4 focus:ring-indigo-50 outline-none transition-all resize-none"
                placeholder="الفصول القانونية، الاجتهادات القضائية..."
                value={grounds}
                onChange={e => setGrounds(e.target.value)}
              ></textarea>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 pr-2">الطلبات الختامية</label>
              <input 
                type="text"
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 text-sm focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                placeholder="بماذا تلتمس من المحكمة الحكم؟"
                value={demands}
                onChange={e => setDemands(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
               {['formal', 'aggressive', 'academic'].map(s => (
                 <button 
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${style === s ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}
                 >
                   {s === 'formal' ? 'رسمي' : s === 'aggressive' ? 'هجومي' : 'أكاديمي'}
                 </button>
               ))}
            </div>
            <button 
              onClick={generateComplexMemo}
              disabled={loading || !facts}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xl hover:bg-black shadow-xl transition-all flex items-center justify-center gap-4"
            >
              {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-wand-sparkles text-indigo-400"></i>}
              {loading ? 'جاري الصياغة...' : 'توليد المذكرة النهائية'}
            </button>
          </div>

          <div className="relative">
             <div className="absolute top-0 right-0 w-full h-full bg-slate-50 rounded-[2.5rem] border-2 border-slate-100 p-8 overflow-y-auto custom-scrollbar">
                {draft ? (
                  <div className="prose prose-slate max-w-none">
                     <div className="flex justify-between items-center mb-6 border-b pb-4">
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">المسودة المقترحة</span>
                        <button onClick={() => {navigator.clipboard.writeText(draft); alert('تم النسخ');}} className="text-slate-400 hover:text-indigo-600 transition-colors"><i className="fa-solid fa-copy"></i></button>
                     </div>
                     <div className="whitespace-pre-wrap text-sm leading-loose font-medium text-slate-700 font-serif">
                        {draft}
                     </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-20 space-y-4">
                     <i className="fa-solid fa-file-pen text-6xl"></i>
                     <p className="font-black">بانتظار إدخال المعطيات لتوليد النص...</p>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartDraftingStudio;
