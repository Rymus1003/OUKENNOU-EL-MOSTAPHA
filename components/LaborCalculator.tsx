
import React, { useState } from 'react';

const LaborCalculator: React.FC = () => {
  const [salary, setSalary] = useState<number>(4000);
  const [years, setYears] = useState<number>(5);
  const [isJustified, setIsJustified] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    // حسابات تبسيطية وفق مدونة الشغل المغربية (أغراض العرض التقني)
    const annualSalary = salary;
    
    // 1. تعويض الإخطار (Préavis) - عادة شهرين للأطر وشهر للمستخدمين
    const preavis = salary * 1; 

    // 2. تعويض الفصل (Licenciement) - ساعات عن كل سنة
    // السنوات 1-5: 96 ساعة/سنة | 6-10: 144 ساعة/سنة ...
    let hourlyRate = salary / 191; // معدل الساعة القانوني
    let dismissalIndemnity = 0;
    
    for (let i = 1; i <= years; i++) {
      if (i <= 5) dismissalIndemnity += (96 * hourlyRate);
      else if (i <= 10) dismissalIndemnity += (144 * hourlyRate);
      else if (i <= 15) dismissalIndemnity += (192 * hourlyRate);
      else dismissalIndemnity += (240 * hourlyRate);
    }

    // 3. تعويض الضرر (Dommages et Intérêts) - 1.5 شهر عن كل سنة (بحد أقصى 36 شهر)
    const damages = Math.min(salary * 1.5 * years, salary * 36);

    const total = preavis + dismissalIndemnity + damages;

    setResult({
      preavis: preavis.toFixed(2),
      dismissal: dismissalIndemnity.toFixed(2),
      damages: damages.toFixed(2),
      total: total.toFixed(2)
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-right" dir="rtl">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
        <header className="flex items-center gap-5 mb-12">
          <div className="w-16 h-16 bg-blue-700 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <i className="fa-solid fa-briefcase text-2xl"></i>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-800">حاسبة تعويضات الطرد التعسفي</h3>
            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mt-1">تطبيق مقتضيات مدونة الشغل المغربية</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-black text-slate-400 mb-3 pr-2">الأجر الشهري الصافي (د.م)</label>
              <input type="number" value={salary} onChange={(e) => setSalary(parseInt(e.target.value))} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-black focus:ring-4 focus:ring-blue-50 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 mb-3 pr-2">الأقدمية (بالسنوات)</label>
              <input type="number" value={years} onChange={(e) => setYears(parseInt(e.target.value))} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-black focus:ring-4 focus:ring-blue-50 outline-none" />
            </div>
            <button onClick={calculate} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xl hover:bg-black shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-4">
              <i className="fa-solid fa-calculator text-blue-400"></i>
              احسب مجموع التعويضات
            </button>
          </div>

          <div className="bg-blue-50 p-8 rounded-[2.5rem] border border-blue-100 flex flex-col justify-center">
             <div className="flex items-center gap-3 mb-4 text-blue-800">
                <i className="fa-solid fa-circle-info"></i>
                <h4 className="font-black text-sm m-0">ملاحظات المسطرة الاجتماعية:</h4>
             </div>
             <ul className="text-xs font-bold text-blue-700/70 space-y-3 leading-relaxed">
                <li>• يتم احتساب الأجر بناءً على متوسط آخر 3 أشهر.</li>
                <li>• تعويض الفصل (Indemnité de licenciement) معفى من الضريبة.</li>
                <li>• تعويض الضرر يخضع للسلطة التقديرية للقاضي بحد أقصى 36 شهراً.</li>
             </ul>
          </div>
        </div>

        {result && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4 animate-in zoom-in-95 duration-500">
             {[
               { label: 'إخطار (Préavis)', val: result.preavis, color: 'text-slate-600' },
               { label: 'فصل (Ancienneté)', val: result.dismissal, color: 'text-slate-600' },
               { label: 'ضرر (Dommages)', val: result.damages, color: 'text-slate-600' },
               { label: 'الإجمالي المستحق', val: result.total, color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' }
             ].map((item, i) => (
               <div key={i} className={`p-6 rounded-2xl border border-slate-100 text-center ${item.bg || 'bg-white shadow-sm'}`}>
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-2">{item.label}</p>
                  <p className={`text-xl font-black ${item.color}`}>{Number(item.val).toLocaleString()} <span className="text-[10px]">د.م</span></p>
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LaborCalculator;
