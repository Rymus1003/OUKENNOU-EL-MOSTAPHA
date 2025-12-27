
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { api } from '../api';

const ConstitutionalAssistant: React.FC = () => {
  const [lawArticle, setLawArticle] = useState('');
  const [constitutionalRight, setConstitutionalRight] = useState('');
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);

  const generateConstitutionalPlea = async () => {
    if (!lawArticle) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        أنت محامٍ مغربي خبير في القانون الدستوري ومساطر المحكمة الدستورية.
        المطلوب: صياغة "مذكرة دفع بعدم الدستورية" (Exception d'inconstitutionnalité) بناءً على الفصل 133 من الدستور المغربي.
        
        المعطيات:
        - المقتضى القانوني المطعون فيه: "${lawArticle}"
        - الحق أو الحرية الدستورية التي ينتهكها: "${constitutionalRight}"
        
        المتطلبات:
        1. الالتزام بالشروط الشكلية (إثارة الدفع بموجب مذكرة مستقلة ومكتوبة).
        2. تحليل جدية الدفع (Le caractère sérieux).
        3. الإشارة إلى قرارات المحكمة الدستورية المغربية السابقة ذات الصلة.
        4. صياغة التماسات دقيقة بإحالة الدفع على المحكمة الدستورية ووقف البت في الدعوى الأصلية.
        
        اللغة: عربية قانونية عالية المستوى.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });

      const content = response.text || 'فشل في صياغة الدفع.';
      setDraft(content);

      await api.saveDraft({
        title: `دفع بعدم الدستورية: ${lawArticle.substring(0, 30)}...`,
        content: content,
        type: 'Constitutional'
      });
    } catch (error) {
      setDraft('حدث خطأ أثناء معالجة الدفع الدستوري.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-right" dir="rtl">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-50/50 via-transparent to-transparent pointer-events-none"></div>
        
        <header className="flex items-center gap-5 mb-10 relative z-10">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-2">
            <i className="fa-solid fa-building-columns text-2xl text-amber-500"></i>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-800">مساعد القضاء الدستوري</h3>
            <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest mt-1">الدفع بعدم الدستورية وفق الفصل 133</p>
          </div>
        </header>

        <div className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-400 uppercase pr-2">النص القانوني المراد الطعن فيه</label>
              <textarea 
                className="w-full h-32 bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 text-sm font-bold focus:ring-4 focus:ring-amber-50 outline-none transition-all resize-none shadow-inner"
                placeholder="مثال: المادة... من قانون المسطرة الجنائية التي تمنع..."
                value={lawArticle}
                onChange={e => setLawArticle(e.target.value)}
              ></textarea>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-400 uppercase pr-2">الحق الدستوري المنتهك</label>
              <textarea 
                className="w-full h-32 bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 text-sm font-bold focus:ring-4 focus:ring-amber-50 outline-none transition-all resize-none shadow-inner"
                placeholder="مثال: الحق في المحاكمة العادلة، حرية التنقل، المساواة..."
                value={constitutionalRight}
                onChange={e => setConstitutionalRight(e.target.value)}
              ></textarea>
            </div>
          </div>

          <button 
            onClick={generateConstitutionalPlea}
            disabled={loading || !lawArticle}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xl hover:bg-black shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-4"
          >
            {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-scroll-old"></i>}
            {loading ? 'جاري التحليل الدستوري...' : 'توليد مذكرة الدفع بعدم الدستورية'}
          </button>
        </div>

        {draft && (
          <div className="mt-12 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-200 animate-in fade-in slide-in-from-bottom-5 duration-700 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-2 h-full bg-amber-500"></div>
             <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
                <h4 className="font-black text-slate-800 m-0 text-sm">مسودة مذكرة الدفع:</h4>
                <button onClick={() => {navigator.clipboard.writeText(draft); alert('تم النسخ');}} className="text-amber-600 hover:scale-110 transition-transform"><i className="fa-solid fa-copy"></i></button>
             </div>
             <div className="prose prose-amber max-w-none whitespace-pre-wrap text-sm leading-loose font-medium text-slate-700">
                {draft}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConstitutionalAssistant;
