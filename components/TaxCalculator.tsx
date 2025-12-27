
import React, { useState } from 'react';

const TaxCalculator: React.FC = () => {
  const [suitValue, setSuitValue] = useState<string>('');
  const [courtType, setCourtType] = useState('first_instance');
  const [tax, setTax] = useState<number | null>(null);

  const calculateTax = () => {
    const value = parseFloat(suitValue);
    if (isNaN(value)) return;

    let result = 0;
    if (courtType === 'commercial') {
      // Example logic for Moroccan Commercial Court: 1% with min 500DH and max 5000DH (Simplified for UI)
      result = value * 0.01;
      if (result < 500) result = 500;
      if (result > 5000) result = 5000;
    } else {
      // Example for First Instance: tiered percentage
      if (value <= 3000) result = 100;
      else if (value <= 6000) result = 200;
      else result = value * 0.025; // 2.5% simplified
    }
    setTax(result);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-right" dir="rtl">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
        <header className="flex items-center gap-5 mb-10">
          <div className="w-16 h-16 bg-rose-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <i className="fa-solid fa-calculator text-2xl"></i>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-800">حاسبة الرسوم القضائية</h3>
            <p className="text-[10px] text-rose-600 font-bold uppercase tracking-widest mt-1">تقدير المصاريف القضائية (Taxe Judiciaire)</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
           <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pr-2">نوع المحكمة</label>
              <select 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-rose-50 outline-none transition-all"
                value={courtType}
                onChange={(e) => setCourtType(e.target.value)}
              >
                <option value="first_instance">المحكمة الابتدائية (قضاء عام)</option>
                <option value="commercial">المحكمة التجارية</option>
                <option value="administrative">المحكمة الإدارية</option>
                <option value="family">قسم قضاء الأسرة</option>
              </select>
           </div>
           <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pr-2">قيمة الطلب / النزاع</label>
              <div className="relative">
                <input 
                  type="number" 
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-lg font-black focus:ring-4 focus:ring-rose-50 outline-none transition-all"
                  placeholder="0.00"
                  value={suitValue}
                  onChange={(e) => setSuitValue(e.target.value)}
                />
                <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-300">د.م</span>
              </div>
           </div>
        </div>

        <button 
          onClick={calculateTax}
          disabled={!suitValue}
          className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xl hover:bg-black shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-4"
        >
          <i className="fa-solid fa-coins text-rose-500"></i>
          احسب الرسم القضائي التقريبي
        </button>

        {tax !== null && (
          <div className="mt-10 p-8 bg-rose-50 rounded-[2.5rem] border border-rose-100 animate-in zoom-in-95 duration-500 flex flex-col items-center gap-4">
             <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">الرسم القضائي المستحق</p>
             <div className="text-6xl font-black text-slate-900">
                {tax.toLocaleString()} <span className="text-xl">د.م</span>
             </div>
             <div className="mt-4 flex items-center gap-2 text-rose-700 bg-white px-6 py-2 rounded-full border border-rose-100 shadow-sm">
                <i className="fa-solid fa-circle-info"></i>
                <p className="text-xs font-bold italic">هذا الحساب تقديري بناءً على الملحق الجبائي المغربي.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaxCalculator;
