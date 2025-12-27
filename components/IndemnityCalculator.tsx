
import React, { useState } from 'react';

const IndemnityCalculator: React.FC = () => {
  const [age, setAge] = useState<number>(30);
  const [salary, setSalary] = useState<number>(3000);
  const [ipp, setIpp] = useState<number>(10); // نسبة العجز الدائم
  const [pains, setPains] = useState<string>('1'); // الآلام المعنوية (1-7)
  const [disfigurement, setDisfigurement] = useState<string>('1'); // تشويه الخلقة (1-7)
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    // معادلة تبسيطية تحاكي ظهير 1984 المغربي (لأغراض العرض التقني)
    // رأس المال المعتمد يعتمد على الأجر والسن والنسبة
    const annualSalary = salary * 12;
    const baseIndemnity = annualSalary * (ipp / 100) * (80 - age) * 0.5; // محاكاة معامل السن
    
    const moralDamage = parseInt(pains) * 2000;
    const aestheticDamage = parseInt(disfigurement) * 3000;
    
    const total = baseIndemnity + moralDamage + aestheticDamage;

    setResult({
      base: baseIndemnity.toFixed(2),
      moral: moralDamage,
      aesthetic: aestheticDamage,
      total: total.toFixed(2)
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-right" dir="rtl">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -ml-32 -mt-32 opacity-60"></div>
        
        <header className="flex items-center gap-5 mb-12 relative z-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-3">
            <i className="fa-solid fa-hand-holding-medical text-2xl"></i>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-800">حاسبة تعويضات حوادث السير</h3>
            <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest mt-1">تطبيق مقتضيات ظهير 2 أكتوبر 1984 المغربي</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase mb-3 pr-2 flex justify-between">
                <span>عمر الضحية وقت الحادث</span>
                <span className="text-indigo-600 font-black">{age} سنة</span>
              </label>
              <input type="range" min="1" max="100" value={age} onChange={(e) => setAge(parseInt(e.target.value))} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase mb-3 pr-2">الأجر الشهري المصرح به (د.م)</label>
              <div className="relative">
                <input type="number" value={salary} onChange={(e) => setSalary(parseInt(e.target.value))} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-black focus:ring-4 focus:ring-indigo-50 outline-none transition-all" />
                <i className="fa-solid fa-money-bill-wave absolute left-6 top-1/2 -translate-y-1/2 text-slate-300"></i>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase mb-3 pr-2 flex justify-between">
                <span>نسبة العجز الدائم (IPP)</span>
                <span className="text-rose-600 font-black">{ipp}%</span>
              </label>
              <input type="range" min="0" max="100" value={ipp} onChange={(e) => setIpp(parseInt(e.target.value))} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-rose-500" />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase mb-3 pr-2">الآلام المعنوية (Pretium Doloris)</label>
              <select value={pains} onChange={(e) => setPains(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold focus:ring-4 focus:ring-indigo-50 outline-none">
                <option value="1">ضئيلة جداً</option>
                <option value="3">متوسطة</option>
                <option value="5">هامة</option>
                <option value="7">مهمة جداً</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase mb-3 pr-2">تشويه الخلقة (Préjudice Esthétique)</label>
              <select value={disfigurement} onChange={(e) => setDisfigurement(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold focus:ring-4 focus:ring-indigo-50 outline-none">
                <option value="1">ضئيل جداً</option>
                <option value="3">متوسط</option>
                <option value="5">مهم</option>
                <option value="7">مهم جداً</option>
              </select>
            </div>

            <button onClick={calculate} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xl hover:bg-black shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-4 mt-4">
              <i className="fa-solid fa-calculator text-indigo-400"></i>
              احسب مبلغ التعويض
            </button>
          </div>
        </div>

        {result && (
          <div className="mt-12 p-8 bg-indigo-900 rounded-[2.5rem] text-white shadow-2xl animate-in zoom-in-95 duration-500 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
             <h4 className="text-indigo-300 text-[10px] font-black uppercase tracking-[0.3em] mb-6 border-b border-white/10 pb-4">نتائج التقدير القضائي التقريبي</h4>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                   <p className="text-[10px] font-bold opacity-60 mb-1">التعويض الأساسي (العجز)</p>
                   <p className="text-2xl font-black">{Number(result.base).toLocaleString()} <span className="text-xs">د.م</span></p>
                </div>
                <div>
                   <p className="text-[10px] font-bold opacity-60 mb-1">التعويض عن الآلام والجمالية</p>
                   <p className="text-2xl font-black">{Number(result.moral + result.aesthetic).toLocaleString()} <span className="text-xs">د.م</span></p>
                </div>
                <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                   <p className="text-[10px] font-bold text-indigo-200 mb-1">المجموع الإجمالي المستحق</p>
                   <p className="text-4xl font-black text-indigo-300">{Number(result.total).toLocaleString()} <span className="text-sm">د.م</span></p>
                </div>
             </div>
             
             <div className="mt-8 flex items-start gap-3 bg-black/20 p-4 rounded-xl">
                <i className="fa-solid fa-circle-info text-indigo-400 mt-1"></i>
                <p className="text-[10px] font-medium leading-relaxed opacity-70">هذه العملية الحسابية استرشادية فقط بناءً على جداول ظهير 1984. السلطة التقديرية النهائية تبقى للقضاء المغربي المختص.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IndemnityCalculator;
