
import React, { useState } from 'react';

const AlimonyCalculator: React.FC = () => {
  const [income, setIncome] = useState<number>(4000);
  const [childCount, setChildCount] = useState<number>(1);
  const [includeHousing, setIncludeHousing] = useState<boolean>(true);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    // تقديرات مبنية على العرف القضائي المغربي (تقدير تقريبي)
    const baseChildAlimony = income * 0.15; // 15% لكل طفل تقريباً
    const totalChildAlimony = baseChildAlimony * childCount;
    
    let housing = 0;
    if (includeHousing) {
      housing = Math.min(income * 0.25, 1500); // واجب السكن عادة لا يتجاوز 25% من الدخل
    }

    const total = totalChildAlimony + housing;

    setResult({
      perChild: baseChildAlimony.toFixed(2),
      housing: housing.toFixed(2),
      total: total.toFixed(2)
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-right" dir="rtl">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
        <header className="flex items-center gap-5 mb-10">
          <div className="w-16 h-16 bg-pink-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <i className="fa-solid fa-child-reaching text-2xl"></i>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-800">حاسبة تقدير النفقة</h3>
            <p className="text-[10px] text-pink-600 font-bold uppercase tracking-widest mt-1">وفق مقتضيات مدونة الأسرة المغربية</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase mb-3 pr-2">الدخل الشهري الصافي للملزم بالنفقة (د.م)</label>
              <input 
                type="number" 
                value={income} 
                onChange={(e) => setIncome(parseInt(e.target.value))}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-black focus:ring-4 focus:ring-pink-50 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase mb-3 pr-2">عدد الأطفال</label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map(n => (
                  <button 
                    key={n}
                    onClick={() => setChildCount(n)}
                    className={`flex-1 py-3 rounded-xl font-black transition-all ${childCount === n ? 'bg-pink-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}
                  >{n}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-slate-700">شامل لواجب السكن؟</span>
                <button 
                  onClick={() => setIncludeHousing(!includeHousing)}
                  className={`w-14 h-8 rounded-full relative transition-all ${includeHousing ? 'bg-pink-500' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${includeHousing ? 'left-1' : 'left-7'}`}></div>
                </button>
              </div>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">ملاحظة: واجب السكن يحدد استقلالاً عن النفقة في حالة عدم توفر بيت الزوجية.</p>
            </div>
            
            <button 
              onClick={calculate}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xl hover:bg-black shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-4"
            >
              <i className="fa-solid fa-calculator text-pink-400"></i>
              تقدير مبلغ النفقة
            </button>
          </div>
        </div>

        {result && (
          <div className="mt-8 p-8 bg-pink-50 rounded-[2.5rem] border border-pink-100 animate-in zoom-in-95 duration-500">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-white rounded-2xl shadow-sm">
                   <p className="text-[10px] font-black text-slate-400 uppercase mb-2">نفقة كل طفل</p>
                   <p className="text-2xl font-black text-slate-900">{result.perChild} <span className="text-xs">د.م</span></p>
                </div>
                <div className="text-center p-4 bg-white rounded-2xl shadow-sm">
                   <p className="text-[10px] font-black text-slate-400 uppercase mb-2">واجب السكن</p>
                   <p className="text-2xl font-black text-slate-900">{result.housing} <span className="text-xs">د.م</span></p>
                </div>
                <div className="text-center p-4 bg-pink-600 rounded-2xl shadow-lg text-white">
                   <p className="text-[10px] font-black opacity-80 uppercase mb-2">المجموع الشهري</p>
                   <p className="text-3xl font-black">{result.total} <span className="text-sm">د.م</span></p>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlimonyCalculator;
