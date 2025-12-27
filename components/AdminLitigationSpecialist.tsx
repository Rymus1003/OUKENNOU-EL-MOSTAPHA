
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const AdminLitigationSpecialist: React.FC = () => {
  const [decisionDetails, setDecisionDetails] = useState('');
  const [adminEntity, setAdminEntity] = useState('');
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);

  const generateAdminCase = async () => {
    if (!decisionDetails) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        أنت محامٍ مغربي متخصص في المنازعات الإدارية أمام المحاكم الإدارية ومحاكم الاستئناف الإدارية.
        قم بصياغة "مقال افتتاحي لدعوى الإلغاء بسبب الشطط في استعمال السلطة" (Recours pour excès de pouvoir).
        
        المعطيات:
        - الإدارة المدعى عليها: ${adminEntity}
        - موضوع القرار الإداري المطعون فيه: ${decisionDetails}
        
        المطلوب منك في الصياغة:
        1. تخصيص حيز بارز للشكليات القانونية (Formalités légales):
           - تحديد الاختصاص القضائي النوعي والمحلي للمحكمة.
           - التحقق من استيفاء أجل الطعن القانوني (عادة 60 يوماً من تاريخ التبليغ أو النشر وفق مقتضيات القانون 41-90).
           - ذكر قائمة المستندات والوثائق الواجب إرفاقها بالمقال لتعزيز وسائله.
        2. التمسك بأوجه الطعن: خرق القانون، عيب الشكـل، انعدام التعليل، أو الانحراف في استعمال السلطة.
        3. الإشارة الصريحة إلى مقتضيات القانون رقم 41-90 المحدث للمحاكم الإدارية.
        4. صياغة التماسات دقيقة (قبول الطلب شكلاً، وفي الموضوع إلغاء القرار المطعون فيه مع ما يترتب عن ذلك من آثار قانونية).
        5. استخدام لغة إدارية قانونية صارمة ورصينة تعكس هيبة القضاء الإداري المغربي.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });

      setDraft(response.text || 'فشل توليد المقال الإداري.');
    } catch (error) {
      setDraft('خطأ في الاتصال بالنظام.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-right" dir="rtl">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden relative">
        <header className="flex items-center gap-5 mb-10">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-2">
            <i className="fa-solid fa-building-columns text-2xl text-blue-400"></i>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-800">مساعد القضاء الإداري</h3>
            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mt-1">دعاوى الإلغاء والتعويض ضد الإدارة والمؤسسات العمومية</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
           <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase pr-2">الجهة الإدارية (الوزارة، الجماعة، المؤسسة)</label>
              <input 
                type="text" 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold focus:ring-4 focus:ring-blue-50 outline-none"
                placeholder="مثال: السيد وزير الداخلية، رئيس المجلس الجماعي..."
                value={adminEntity}
                onChange={e => setAdminEntity(e.target.value)}
              />
           </div>
           <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase pr-2">تفاصيل القرار الإداري المطعون فيه</label>
              <input 
                type="text" 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold focus:ring-4 focus:ring-blue-50 outline-none"
                placeholder="رقم القرار وتاريخه وموضوعه..."
                value={decisionDetails}
                onChange={e => setDecisionDetails(e.target.value)}
              />
           </div>
        </div>

        <button 
          onClick={generateAdminCase}
          disabled={loading || !decisionDetails}
          className="w-full bg-blue-700 text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-800 shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-4"
        >
          {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-file-shield"></i>}
          {loading ? 'جاري تحليل القرار الإداري...' : 'توليد مقال دعوى الإلغاء'}
        </button>

        {draft && (
          <div className="mt-12 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-200 animate-in fade-in slide-in-from-bottom-5 duration-700">
             <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div className="flex items-center gap-3">
                   <i className="fa-solid fa-scroll text-blue-600"></i>
                   <h4 className="font-black text-slate-800 m-0">مسودة المقال الافتتاحي (إداري):</h4>
                </div>
                <button onClick={() => {navigator.clipboard.writeText(draft); alert('تم النسخ');}} className="text-blue-600 hover:scale-110 transition-transform"><i className="fa-solid fa-copy"></i></button>
             </div>
             <div className="prose prose-blue max-w-none whitespace-pre-wrap text-sm leading-[2] font-medium text-slate-700">
                {draft}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLitigationSpecialist;
