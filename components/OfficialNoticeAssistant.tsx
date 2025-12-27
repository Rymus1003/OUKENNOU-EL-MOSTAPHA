
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { api } from '../api';

const OfficialNoticeAssistant: React.FC = () => {
  const [noticeType, setNoticeType] = useState('rent_arrears');
  const [details, setDetails] = useState('');
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);

  const generateNotice = async () => {
    if (!details) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const types: Record<string, string> = {
        'rent_arrears': 'إنذار بأداء الوجيبة الكرائية (Mise en demeure - Loyer)',
        'interpellation': 'إنذار استجوابي (Sommation interpellative)',
        'formal_notice': 'إنذار قبل التقاضي (Mise en demeure générale)',
        'vacate': 'إنذار بالإفراغ للاحتياج الشخصي'
      };

      const prompt = `
        أنت محامٍ مغربي متخصص في مساطر التبليغ والتنفيذ.
        المطلوب: صياغة "${types[noticeType]}" ليتم تبليغه عن طريق المفوض القضائي.
        
        المعطيات: "${details}"
        
        المتطلبات:
        1. في إنذار الكراء: الإشارة إلى المادة 26 من قانون 67.12 وتحديد مهلة 15 يوماً.
        2. في الإنذار الاستجوابي: صياغة الأسئلة الموجهة للطرف الآخر بدقة (Questionnaire).
        3. التذكير بالآثار القانونية المترتبة عن عدم الاستجابة (التماطل، فتح باب التقاضي).
        4. ذكر هوية الموكل والمنذر إليه بدقة.
        
        اللغة: قانونية تقنية، واضحة، وحازمة.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });

      const content = response.text || 'فشل في توليد الإنذار.';
      setDraft(content);

      await api.saveDraft({
        title: `إنذار: ${types[noticeType]}`,
        content: content,
        type: 'Notice'
      });
    } catch (error) {
      setDraft('حدث خطأ أثناء صياغة الإنذار.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-right" dir="rtl">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden relative">
        <header className="flex items-center gap-5 mb-10">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-2">
            <i className="fa-solid fa-bullhorn text-2xl text-rose-400"></i>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-800">مساعد التبليغ والإنذارات</h3>
            <p className="text-[10px] text-rose-600 font-bold uppercase tracking-widest mt-1">صياغة الإنذارات الرسمية للمفوضين القضائيين</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
           <div className="space-y-4">
              <label className="block text-[10px] font-black text-slate-400 uppercase pr-2">نوع الإنذار</label>
              <div className="flex flex-col gap-2">
                 {[
                   { id: 'rent_arrears', label: 'أداء وجيبة كرائية' },
                   { id: 'interpellation', label: 'إنذار استجوابي' },
                   { id: 'formal_notice', label: 'إنذار قبل التقاضي' },
                   { id: 'vacate', label: 'إفراغ للسكنى' }
                 ].map(t => (
                   <button 
                    key={t.id}
                    onClick={() => setNoticeType(t.id)}
                    className={`text-right px-6 py-3 rounded-xl text-xs font-black transition-all border-2 ${noticeType === t.id ? 'bg-rose-600 text-white border-rose-600 shadow-md' : 'bg-slate-50 text-slate-500 border-slate-50 hover:border-rose-100'}`}
                   >
                     {t.label}
                   </button>
                 ))}
              </div>
           </div>
           <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase pr-2">بيانات الأطراف، المبالغ، والسبب</label>
              <textarea 
                className="w-full h-48 bg-slate-50 border-2 border-slate-100 rounded-2xl p-6 text-sm font-bold focus:ring-4 focus:ring-rose-50 outline-none transition-all resize-none shadow-inner"
                placeholder="أدخل أسماء الأطراف، العنوان، ومبلغ الدين أو السؤال الاستجوابي..."
                value={details}
                onChange={e => setDetails(e.target.value)}
              ></textarea>
           </div>
        </div>

        <button 
          onClick={generateNotice}
          disabled={loading || !details}
          className="w-full bg-rose-700 text-white py-5 rounded-2xl font-black text-xl hover:bg-rose-800 shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-4"
        >
          {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-envelope-open-text"></i>}
          {loading ? 'جاري صياغة الإنذار...' : 'توليد مسودة الإنذار الرسمي'}
        </button>

        {draft && (
          <div className="mt-12 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-200 animate-in fade-in slide-in-from-bottom-5 duration-700">
             <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h4 className="font-black text-slate-800 m-0 text-sm">نص الإنذار المقترح:</h4>
                <button onClick={() => {navigator.clipboard.writeText(draft); alert('تم النسخ');}} className="text-rose-600 hover:scale-110 transition-transform"><i className="fa-solid fa-copy"></i></button>
             </div>
             <div className="prose prose-rose max-w-none whitespace-pre-wrap text-sm leading-loose font-medium text-slate-700 italic">
                {draft}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfficialNoticeAssistant;
