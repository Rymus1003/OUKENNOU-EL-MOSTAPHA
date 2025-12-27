
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const HearingSummaryGenerator: React.FC = () => {
  const [rawNotes, setRawNotes] = useState('');
  const [report, setReport] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const formatReport = async () => {
    if (!rawNotes) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        أنت كاتب محاماة محترف. قم بتحويل ملاحظات الجلسة السريعة التالية إلى "تقرير جلسة" رسمي ومنظم للملف:
        "${rawNotes}"
        
        المطلوب:
        1. كتابة التقرير بلغة عربية سليمة.
        2. تقسيم التقرير إلى: (تاريخ الجلسة، الحضور، الإجراءات التي تمت، القرار المتخذ، موعد الجلسة القادمة، الإجراء المطلوب من المكتب).
        3. إبراز المواعيد والقرارات الهامة.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setReport(response.text || 'تعذر تنسيق التقرير.');
    } catch (error) {
      setReport('خطأ في الاتصال بالذكاء الاصطناعي.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-right" dir="rtl">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
        <header className="flex items-center gap-5 mb-10">
          <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-2">
            <i className="fa-solid fa-file-invoice text-2xl"></i>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-800">منسق تقارير الجلسات</h3>
            <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest mt-1">تحويل الملاحظات الميدانية إلى تقارير احترافية</p>
          </div>
        </header>

        <div className="space-y-6">
          <label className="block text-xs font-black text-slate-400 mb-3 pr-2 uppercase">أدخل ملاحظاتك السريعة عن الجلسة</label>
          <textarea 
            className="w-full h-40 bg-slate-50 border-2 border-slate-100 rounded-[2rem] p-6 text-sm font-medium focus:ring-4 focus:ring-amber-50 outline-none transition-all resize-none shadow-inner"
            placeholder="مثال: جلسة 24 ماي، حضرنا عن المدعي، الخصم طلب مهلة، القاضي أجل لـ 15 جوان للجواب..."
            value={rawNotes}
            onChange={(e) => setRawNotes(e.target.value)}
          ></textarea>

          <button 
            onClick={formatReport}
            disabled={loading || !rawNotes}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xl hover:bg-black shadow-xl transition-all flex items-center justify-center gap-4"
          >
            {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-magic"></i>}
            {loading ? 'جاري صياغة التقرير...' : 'تنسيق التقرير الرسمي'}
          </button>
        </div>

        {report && (
          <div className="mt-12 p-8 bg-amber-50 rounded-[2.5rem] border border-amber-200 animate-in fade-in slide-in-from-bottom-5 duration-700">
             <div className="flex items-center gap-3 mb-6 border-b border-amber-200 pb-4">
                <i className="fa-solid fa-clipboard-check text-amber-600"></i>
                <h4 className="font-black text-slate-800 m-0">التقرير المنظم للجلسة:</h4>
             </div>
             <div className="prose prose-slate max-w-none whitespace-pre-wrap text-sm leading-loose font-medium text-slate-700">
                {report}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HearingSummaryGenerator;
