
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { api } from '../api';

const PrecautionaryAttachmentStudio: React.FC = () => {
  const [debtType, setDebtType] = useState('commercial');
  const [assets, setAssets] = useState('');
  const [debtAmount, setDebtAmount] = useState('');
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);

  const generateAttachmentRequest = async () => {
    if (!assets || !debtAmount) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        أنت محامٍ مغربي متخصص في قضاء المستعجلات والمساطر الخاصة.
        قم بصياغة "طلب من أجل إيقاع حجز تحفظي" (Saisie conservatoire) موجه للسيد رئيس المحكمة بصفته قاضياً للمستعجلات.
        المعطيات:
        - نوع الدين: ${debtType === 'commercial' ? 'دين تجاري ثابت بمقتضى سند' : 'دين مدني'}
        - المبلغ المطالب بتأمينه: ${debtAmount} درهم.
        - الأموال المراد حجزها: ${assets} (عقار، منقولات، حسابات بنكية).
        
        المتطلبات:
        1. الإشارة إلى الفصول 452 وما يليها من قانون المسطرة المدنية.
        2. تحليل "الاستعجال" و "الخطر المحدق بالدين" (Péril en la demeure).
        3. المطالبة بتبليغ الأمر وتنفيذه على الأصل وبموجب المسودة قبل التسجيل بكاتب الضبط.
        4. لغة قانونية صارمة وقوية.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });

      const content = response.text || 'فشل في توليد الطلب.';
      setDraft(content);

      await api.saveDraft({
        title: `حجز تحفظي: ${assets.substring(0, 20)}`,
        content: content,
        type: 'Urgent'
      });
    } catch (error) {
      setDraft('حدث خطأ أثناء معالجة طلب الحجز.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-right" dir="rtl">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-rose-50/50 via-transparent to-transparent pointer-events-none"></div>
        
        <header className="flex items-center gap-5 mb-10 relative z-10">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-2">
            <i className="fa-solid fa-lock text-2xl text-rose-500"></i>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-800">مختبر الحجز التحفظي</h3>
            <p className="text-[10px] text-rose-600 font-bold uppercase tracking-widest mt-1">تأمين حقوق الموكل عبر المساطر الاستعجالية</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 relative z-10">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">نوع الدين والسند</label>
              <select 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-3 font-bold focus:ring-4 focus:ring-rose-50 outline-none"
                value={debtType}
                onChange={e => setDebtType(e.target.value)}
              >
                <option value="commercial">دين تجاري (كمبيالة/شيك)</option>
                <option value="civil">دين مدني ثابت بالكتابة</option>
                <option value="rent">دين كرائي (واجبات الكراء)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">المبلغ المراد تأمينه (د.م)</label>
              <input 
                type="number" 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-3 font-black focus:ring-4 focus:ring-rose-50 outline-none"
                placeholder="0.00"
                value={debtAmount}
                onChange={e => setDebtAmount(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">بيانات الأموال المراد حجزها</label>
            <textarea 
              className="w-full h-[140px] bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 text-sm font-bold focus:ring-4 focus:ring-rose-50 outline-none resize-none shadow-inner"
              placeholder="مثال: العقار ذي الرسم العقاري عدد...، أو الحساب البنكي رقم... المفتوح لدى بنك..."
              value={assets}
              onChange={e => setAssets(e.target.value)}
            ></textarea>
          </div>
        </div>

        <button 
          onClick={generateAttachmentRequest}
          disabled={loading || !assets}
          className="w-full bg-rose-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-rose-700 shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-4 relative z-10"
        >
          {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-stamp"></i>}
          {loading ? 'جاري صياغة الطلب...' : 'توليد طلب الحجز التحفظي'}
        </button>

        {draft && (
          <div className="mt-12 p-8 bg-slate-900 text-rose-50 rounded-[2.5rem] border border-rose-900/50 animate-in fade-in slide-in-from-bottom-5 duration-700">
             <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                <h4 className="font-black m-0 text-sm">مسودة الطلب المقترحة للمحكمة:</h4>
                <div className="flex gap-2">
                   <button onClick={() => {navigator.clipboard.writeText(draft); alert('تم النسخ');}} className="text-rose-400 hover:text-white transition-colors"><i className="fa-solid fa-copy"></i></button>
                   <button onClick={() => window.print()} className="text-slate-400 hover:text-white transition-colors"><i className="fa-solid fa-print"></i></button>
                </div>
             </div>
             <div className="prose prose-invert max-w-none whitespace-pre-wrap text-sm leading-loose font-medium opacity-90 font-serif">
                {draft}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrecautionaryAttachmentStudio;
