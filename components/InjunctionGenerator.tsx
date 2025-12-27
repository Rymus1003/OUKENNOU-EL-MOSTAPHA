
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const InjunctionGenerator: React.FC = () => {
  const [debtor, setDebtor] = useState({ name: '', address: '' });
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState(''); // سند الدين: شيك، كمبيالة، اعتراف بدين
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);

  const generateInjunction = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        بصفتك محامياً مغربياً، قم بصياغة "مقال من أجل استصدار أمر بالأداء" موجه إلى السيد رئيس المحكمة الابتدائية (أو التجارية حسب الحالة).
        المعطيات:
        - المدين: ${debtor.name}، المقيم بـ ${debtor.address}
        - المبلغ المطالب به: ${amount} درهم مغربي.
        - السند المعتمد (وسيلة الإثبات): ${reason}
        
        المطلوب:
        1. الإشارة إلى الفصول 155 إلى 165 من قانون المسطرة المدنية (أو المادة 22 من قانون المحاكم التجارية).
        2. المطالبة بأصل الدين، الفوائد القانونية إن وجدت، والمصاريف القضائية.
        3. الصياغة بلغة عربية قانونية رسمية دقيقة.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });

      setDraft(response.text || 'خطأ في توليد المقال.');
    } catch (error) {
      setDraft('حدث خطأ أثناء معالجة الطلب.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-right" dir="rtl">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
        <header className="flex items-center gap-5 mb-10">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-2">
            <i className="fa-solid fa-file-invoice-dollar text-2xl"></i>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-800">مولد طلبات الأمر بالأداء</h3>
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-1">استصدار أوامر قضائية لاستخلاص الديون الثابتة</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">اسم المدين الكامل</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 text-sm focus:ring-4 focus:ring-emerald-50 outline-none"
                  value={debtor.name}
                  onChange={e => setDebtor({...debtor, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">المبلغ (د.م)</label>
                <input 
                  type="number" 
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 text-sm focus:ring-4 focus:ring-emerald-50 outline-none"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">سند الدين (الحجة المرفقة)</label>
              <textarea 
                className="w-full h-24 bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 text-sm focus:ring-4 focus:ring-emerald-50 outline-none resize-none"
                placeholder="مثال: شيك رقم 12345، كمبيالة مسحوبة بتاريخ..."
                value={reason}
                onChange={e => setReason(e.target.value)}
              ></textarea>
            </div>
            <button 
              onClick={generateInjunction}
              disabled={loading || !amount || !debtor.name}
              className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-emerald-700 shadow-xl transition-all flex items-center justify-center gap-4"
            >
              {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-feather-pointed"></i>}
              {loading ? 'جاري صياغة المقال...' : 'توليد طلب الأمر بالأداء'}
            </button>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col min-h-[400px]">
             <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
             <h4 className="font-black text-emerald-400 text-xs uppercase tracking-widest mb-6 border-b border-white/10 pb-4 flex justify-between items-center">
                <span>مسودة المقال القضائي</span>
                {draft && <button onClick={() => {navigator.clipboard.writeText(draft); alert('تم النسخ');}} className="hover:text-white transition-colors"><i className="fa-solid fa-copy"></i></button>}
             </h4>
             <div className="flex-1 overflow-y-auto custom-scrollbar prose prose-invert max-w-none">
                {draft ? (
                  <div className="whitespace-pre-wrap text-sm leading-loose font-serif opacity-90">{draft}</div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-20 space-y-4">
                     <i className="fa-solid fa-file-invoice text-6xl"></i>
                     <p className="font-bold">بانتظار البيانات...</p>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InjunctionGenerator;
