
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

interface DeadlineResult {
  deadlineDate: string;
  daysCount: number;
  legalBasis: string;
  notes: string;
}

const LegalDeadlineCalculator: React.FC = () => {
  const [notificationDate, setNotificationDate] = useState('');
  const [caseType, setCaseType] = useState('civil');
  const [procedure, setProcedure] = useState('appeal');
  const [result, setResult] = useState<DeadlineResult | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateDeadline = async () => {
    if (!notificationDate) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `أنا محامٍ مغربي. قمت بتبليغ حكم في قضية ${caseType === 'civil' ? 'مدنية' : 'جنائية'} بتاريخ ${notificationDate}. أريد حساب أجل ${procedure === 'appeal' ? 'الاستئناف' : 'النقض'} وفق القانون المغربي. 
      أعطني النتيجة بتنسيق JSON يتضمن: تاريخ انتهاء الأجل (deadlineDate)، عدد الأيام القانوني (daysCount)، المرجع القانوني من قانون المسطرة (legalBasis)، وملاحظات حول كيفية احتساب الأيام (كاملة أو غير كاملة).`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              deadlineDate: { type: Type.STRING },
              daysCount: { type: Type.NUMBER },
              legalBasis: { type: Type.STRING },
              notes: { type: Type.STRING }
            },
            required: ['deadlineDate', 'daysCount', 'legalBasis', 'notes']
          }
        }
      });

      const data = JSON.parse(response.text || '{}');
      setResult(data);
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء حساب الأجل القانوني.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-right" dir="rtl">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-rose-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <i className="fa-solid fa-hourglass-end text-2xl"></i>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800">حاسبة الآجال القانونية</h3>
            <p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest">التوافق مع قانون المسطرة المدنية والجنائية</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-xs font-black text-slate-400 mb-2 uppercase">تاريخ التبليغ</label>
            <input 
              type="date" 
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-3 text-sm font-bold focus:ring-4 focus:ring-rose-50 outline-none"
              value={notificationDate}
              onChange={e => setNotificationDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 mb-2 uppercase">نوع المادة</label>
            <select 
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-3 text-sm font-bold focus:ring-4 focus:ring-rose-50 outline-none"
              value={caseType}
              onChange={e => setCaseType(e.target.value)}
            >
              <option value="civil">مدني / تجاري / إداري</option>
              <option value="criminal">جنائي / جنحي</option>
              <option value="family">قضاء الأسرة</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 mb-2 uppercase">المسطرة المطلوبة</label>
            <select 
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-3 text-sm font-bold focus:ring-4 focus:ring-rose-50 outline-none"
              value={procedure}
              onChange={e => setProcedure(e.target.value)}
            >
              <option value="appeal">استئناف حكم</option>
              <option value="cassation">نقض قرار</option>
              <option value="opposition">تعرض على حكم غيابي</option>
            </select>
          </div>
        </div>

        <button 
          onClick={calculateDeadline}
          disabled={loading || !notificationDate}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-black transition-all shadow-xl flex items-center justify-center gap-3"
        >
          {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-calculator"></i>}
          حساب الأجل النهائي للطعن
        </button>

        {result && (
          <div className="mt-10 p-8 bg-rose-50 rounded-[2.5rem] border border-rose-100 animate-in zoom-in-95 duration-500">
             <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                <div className="flex-1 space-y-4">
                   <div className="bg-white p-4 rounded-2xl inline-block shadow-sm">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">آخر أجل للقيام بالمسطرة</p>
                      <p className="text-3xl font-black text-rose-600">{new Date(result.deadlineDate).toLocaleDateString('ar-MA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                   </div>
                   <div className="space-y-2">
                      <h4 className="font-bold text-slate-800">السند القانوني:</h4>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">{result.legalBasis}</p>
                   </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm text-center min-w-[150px]">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">مدة الأجل</p>
                   <div className="text-5xl font-black text-rose-500">{result.daysCount}</div>
                   <p className="text-xs font-bold text-slate-400 mt-1">يوماً قانونياً</p>
                </div>
             </div>
             <div className="mt-6 pt-6 border-t border-rose-100 flex items-center gap-3">
                <i className="fa-solid fa-circle-info text-rose-400"></i>
                <p className="text-xs text-rose-700 font-bold italic">{result.notes}</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LegalDeadlineCalculator;
