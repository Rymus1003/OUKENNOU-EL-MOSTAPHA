
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { api } from '../api';

const CassationDraftingStudio: React.FC = () => {
  const [judgmentSummary, setJudgmentSummary] = useState('');
  const [violationType, setViolationType] = useState('law_breach');
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);

  const generatePetition = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        أنت محامٍ مغربي مقبول لدى محكمة النقض. قم بصياغة "عريضة نقض" (Requête en cassation) موجهة للسيد الرئيس الأول لمحكمة النقض بالرباط.
        ملخص القرار المطعون فيه: "${judgmentSummary}"
        السبب الرئيسي للنقض: ${violationType === 'law_breach' ? 'خرق القانون الداخلي' : violationType === 'no_reasoning' ? 'انعدام التعليل أو نقصانه' : 'تجاوز السلطة'}
        
        المطلوب:
        1. التزام الهيكلة الشكلية الدقيقة (المعروض على محكمة النقض، الوسيلة الوحيدة أو الوسائل، لهذه الأسباب).
        2. الإشارة إلى الفصول 353 وما يليها من قانون المسطرة المدنية.
        3. صياغة رصينة وقوية تفند منطق القرار المطعون فيه.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });

      const content = response.text || 'خطأ في التوليد.';
      setDraft(content);
      
      // Auto-save attempt
      await api.saveDraft({
        title: `عريضة نقض - ${new Date().toLocaleDateString('ar-MA')}`,
        content: content,
        type: 'Cassation'
      });
    } catch (error) {
      setDraft('فشل في معالجة طلب النقض.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 text-right" dir="rtl">
      <div className="bg-white p-10 rounded-[4rem] shadow-2xl border border-slate-100 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-indigo-50/50 via-transparent to-transparent pointer-events-none"></div>
        
        <header className="flex items-center gap-6 mb-12 relative z-10">
          <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white shadow-2xl">
            <i className="fa-solid fa-building-columns text-3xl text-indigo-400"></i>
          </div>
          <div>
            <h3 className="text-4xl font-black text-slate-800">محرر عرائض محكمة النقض</h3>
            <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest mt-1">الصياغة المتخصصة لأعلى درجات التقاضي بالمغرب</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
          <div className="space-y-8">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase mb-3 pr-2">ملخص القرار الاستئنافي المطعون فيه</label>
              <textarea 
                className="w-full h-56 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] p-8 text-sm font-medium focus:ring-4 focus:ring-indigo-50 outline-none transition-all resize-none shadow-inner"
                placeholder="أدخل منطوق قرار محكمة الاستئناف وحيثياته الأساسية هنا..."
                value={judgmentSummary}
                onChange={e => setJudgmentSummary(e.target.value)}
              ></textarea>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-black text-slate-400 uppercase pr-2">وجه الطعن الرئيسي (Moyen de cassation)</label>
              <div className="grid grid-cols-1 gap-3">
                 {[
                   { id: 'law_breach', label: 'خرق القانون (Violation de la loi)' },
                   { id: 'no_reasoning', label: 'انعدام التعليل (Défaut de motifs)' },
                   { id: 'excess_power', label: 'تجاوز السلطة (Excès de pouvoir)' }
                 ].map(type => (
                   <button 
                    key={type.id}
                    onClick={() => setViolationType(type.id)}
                    className={`text-right px-6 py-4 rounded-2xl text-xs font-black transition-all border-2 ${violationType === type.id ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl' : 'bg-white text-slate-500 border-slate-50 hover:border-indigo-100'}`}
                   >
                     {type.label}
                   </button>
                 ))}
              </div>
            </div>

            <button 
              onClick={generatePetition}
              disabled={loading || !judgmentSummary}
              className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black text-xl hover:bg-black shadow-2xl transition-all transform active:scale-95 flex items-center justify-center gap-4"
            >
              {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles text-indigo-400"></i>}
              {loading ? 'جاري الصياغة...' : 'توليد عريضة النقض النهائية'}
            </button>
          </div>

          <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden flex flex-col min-h-[600px]">
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
             <div className="flex justify-between items-center mb-8 relative z-10 border-b border-white/10 pb-6">
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">مسودة عريضة النقض</span>
                <div className="flex gap-2">
                   {draft && <button onClick={() => navigator.clipboard.writeText(draft)} className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all text-xs"><i className="fa-solid fa-copy"></i></button>}
                   {draft && <button onClick={() => window.print()} className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center hover:bg-indigo-500 transition-all text-xs"><i className="fa-solid fa-print"></i></button>}
                </div>
             </div>
             <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
                {draft ? (
                  <div className="whitespace-pre-wrap text-sm leading-[2.5] font-serif text-slate-300 italic opacity-90">{draft}</div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-20 space-y-6">
                     <i className="fa-solid fa-feather-pointed text-8xl"></i>
                     <p className="font-black text-lg max-w-xs">يرجى إدخال ملخص القرار الاستئنافي للبدء في صياغة عريضة النقض</p>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CassationDraftingStudio;
