
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { api } from '../api';

const LegalAdviceGenerator: React.FC = () => {
  const [query, setQuery] = useState('');
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);

  const generateAdvice = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        أنت مستشار قانوني مغربي أول. قدم "استشارة قانونية" (Consultation Juridique) مفصلة حول الموضوع التالي:
        "${query}"
        
        المطلوب في هيكلة الاستشارة:
        1. ملخص الوقائع (Résumé des faits).
        2. الإطار القانوني (Cadre juridique) مع ذكر الفصول القانونية المغربية.
        3. التحليل والتطبيق (Analyse et application).
        4. الخلاصة والتوصيات العملية (Conclusion et recommandations).
        
        اجعل الأسلوب واضحاً للموكل ولكن بلغة قانونية سليمة.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });

      const content = response.text || 'فشل في صياغة الاستشارة.';
      setAdvice(content);

      await api.saveDraft({
        title: `استشارة: ${query.substring(0, 30)}...`,
        content: content,
        type: 'Consultation'
      });
    } catch (error) {
      setAdvice('حدث خطأ أثناء معالجة الاستشارة.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-right" dir="rtl">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 relative">
        <header className="flex items-center gap-5 mb-10">
          <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-2">
            <i className="fa-solid fa-comments-legal text-2xl"></i>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-800">صانع المذكرات الاستشارية</h3>
            <p className="text-[10px] text-purple-600 font-bold uppercase tracking-widest mt-1">تحويل الوقائع إلى رأي قانوني محكم للموكل</p>
          </div>
        </header>

        <div className="space-y-6">
          <label className="block text-xs font-black text-slate-400 mb-3 pr-2">اشرح تفاصيل الحالة المراد الحصول على استشارة بشأنها</label>
          <textarea 
            className="w-full h-40 bg-slate-50 border-2 border-slate-100 rounded-[2rem] p-8 text-sm font-medium focus:ring-4 focus:ring-purple-50 outline-none transition-all resize-none shadow-inner"
            placeholder="مثال: أريد معرفة الإجراءات القانونية لفسخ عقد كراء تجاري لعدم أداء الوجيبة الكرائية..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          ></textarea>

          <button 
            onClick={generateAdvice}
            disabled={loading || !query}
            className="w-full bg-purple-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-purple-700 shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-4"
          >
            {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-brain"></i>}
            {loading ? 'جاري تحليل الحالة...' : 'توليد الرأي القانوني الرسمي'}
          </button>
        </div>

        {advice && (
          <div className="mt-12 p-10 bg-slate-50 rounded-[2.5rem] border border-slate-200 animate-in fade-in slide-in-from-bottom-5 duration-700 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-2 h-full bg-purple-500"></div>
             <div className="flex justify-between items-center mb-8 border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3">
                   <i className="fa-solid fa-clipboard-list text-purple-600"></i>
                   <h4 className="font-black text-slate-800 m-0 text-sm">مذكرة الاستشارة القانونية:</h4>
                </div>
                <button onClick={() => {navigator.clipboard.writeText(advice); alert('تم النسخ');}} className="text-slate-400 hover:text-purple-600 transition-colors"><i className="fa-solid fa-copy"></i></button>
             </div>
             <div className="prose prose-purple max-w-none whitespace-pre-wrap text-sm leading-[2] font-medium text-slate-700">
                {advice}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LegalAdviceGenerator;
