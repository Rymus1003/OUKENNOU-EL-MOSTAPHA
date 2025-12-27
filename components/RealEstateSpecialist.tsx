
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const RealEstateSpecialist: React.FC = () => {
  const [propertyInfo, setPropertyInfo] = useState('');
  const [procedureType, setProcedureType] = useState('precautionary_note');
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);

  const generateRealEstateDoc = async () => {
    if (!propertyInfo) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        أنت محامٍ مغربي خبير في القانون العقاري ونظام التحفيظ العقاري (ظهير 12 غشت 1913 والقانون 14.07).
        المطلوب: صياغة محرر قانوني لنوع الإجراء التالي: ${procedureType === 'precautionary_note' ? 'طلب تقييد احتياطي بناء على مقال' : 'مذكرة مطالب بالحق في نزاع عقاري'}
        
        المعطيات:
        - مراجع العقار (رقم الرسم العقاري، الموقع): ${propertyInfo}
        
        المتطلبات:
        1. الإشارة إلى الفصول ذات الصلة من قانون التحفيظ العقاري.
        2. المطالبة بحفظ حقوق الموكل على الرسم العقاري.
        3. صياغة موجهة للسيد المحافظ على الأملاك العقارية أو السيد رئيس المحكمة.
        4. لغة قانونية تقنية دقيقة.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });

      setDraft(response.text || 'فشل في صياغة المحرر العقاري.');
    } catch (error) {
      setDraft('خطأ في معالجة الطلب العقاري.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-right" dir="rtl">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 relative">
        <header className="flex items-center gap-5 mb-10">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-2">
            <i className="fa-solid fa-house-chimney-crack text-2xl"></i>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-800">مساعد النزاعات العقارية</h3>
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-1">مساطر التحفيظ والتقييدات الاحتياطية (ANCFCC)</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
           <div className="space-y-4">
              <label className="block text-[10px] font-black text-slate-400 uppercase pr-2">نوع المسطرة العقارية</label>
              <div className="flex flex-col gap-2">
                 <button onClick={() => setProcedureType('precautionary_note')} className={`text-right px-6 py-3 rounded-xl text-xs font-black transition-all border-2 ${procedureType === 'precautionary_note' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-500 border-slate-50'}`}>تقييد احتياطي (Prénotation)</button>
                 <button onClick={() => setProcedureType('claim')} className={`text-right px-6 py-3 rounded-xl text-xs font-black transition-all border-2 ${procedureType === 'claim' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-500 border-slate-50'}`}>تعرض على التحفيظ (Opposition)</button>
              </div>
           </div>
           <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase pr-2">مراجع الرسم العقاري وتفاصيل النزاع</label>
              <textarea 
                className="w-full h-32 bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 text-sm font-bold focus:ring-4 focus:ring-emerald-50 outline-none transition-all resize-none shadow-inner"
                placeholder="رقم الرسم العقاري، اسم العقار، المدينة، وسبب النزاع..."
                value={propertyInfo}
                onChange={e => setPropertyInfo(e.target.value)}
              ></textarea>
           </div>
        </div>

        <button 
          onClick={generateRealEstateDoc}
          disabled={loading || !propertyInfo}
          className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-emerald-700 shadow-xl transition-all flex items-center justify-center gap-4"
        >
          {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-map-location"></i>}
          {loading ? 'جاري إعداد المسودة العقارية...' : 'توليد المحرر العقاري القانوني'}
        </button>

        {draft && (
          <div className="mt-12 p-8 bg-slate-900 text-emerald-50 rounded-[2.5rem] border border-emerald-900/50 animate-in fade-in slide-in-from-bottom-5 duration-700">
             <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                <h4 className="font-black m-0 text-sm">المسودة المقترحة للمحافظة العقارية/المحكمة:</h4>
                <button onClick={() => {navigator.clipboard.writeText(draft); alert('تم النسخ');}} className="text-emerald-400 hover:text-white transition-colors"><i className="fa-solid fa-copy"></i></button>
             </div>
             <div className="prose prose-invert max-w-none whitespace-pre-wrap text-sm leading-loose font-medium opacity-90">
                {draft}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RealEstateSpecialist;
