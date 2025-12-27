
import React, { useState, useEffect } from 'react';

const OfficeExpenses: React.FC = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [newExp, setNewExp] = useState({ title: '', amount: '', category: 'Transport', date: new Date().toISOString().split('T')[0] });

  useEffect(() => {
    const stored = localStorage.getItem('office_expenses');
    if (stored) setExpenses(JSON.parse(stored));
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExp.title || !newExp.amount) return;
    const updated = [{ ...newExp, id: Date.now() }, ...expenses];
    setExpenses(updated);
    localStorage.setItem('office_expenses', JSON.stringify(updated));
    setNewExp({ title: '', amount: '', category: 'Transport', date: new Date().toISOString().split('T')[0] });
  };

  const removeExp = (id: number) => {
    const updated = expenses.filter(e => e.id !== id);
    setExpenses(updated);
    localStorage.setItem('office_expenses', JSON.stringify(updated));
  };

  const total = expenses.reduce((acc, e) => acc + parseFloat(e.amount || 0), 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-right" dir="rtl">
      <div className="lg:col-span-1">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
          <h3 className="font-black text-slate-800 mb-8 flex items-center gap-3">
            <i className="fa-solid fa-file-invoice-dollar text-rose-500"></i>
            تسجيل مصروف جديد
          </h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">وصف المصروف</label>
              <input 
                type="text" 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-rose-50 outline-none"
                placeholder="مثال: تنقل للمحكمة التجارية، فاتورة انترنت..."
                value={newExp.title}
                onChange={e => setNewExp({...newExp, title: e.target.value})}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">المبلغ (د.م)</label>
                <input 
                  type="number" 
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-rose-50 outline-none"
                  value={newExp.amount}
                  onChange={e => setNewExp({...newExp, amount: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">التصنيف</label>
                <select 
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-rose-50 outline-none"
                  value={newExp.category}
                  onChange={e => setNewExp({...newExp, category: e.target.value})}
                >
                  <option value="Transport">نقل وتواصل</option>
                  <option value="Bills">فواتير (ماء/كهرباء)</option>
                  <option value="Supplies">مستلزمات مكتبية</option>
                  <option value="Salaries">أجور وتعويضات</option>
                  <option value="Other">مصاريف أخرى</option>
                </select>
              </div>
            </div>
            <button type="submit" className="w-full bg-rose-600 text-white font-black py-4 rounded-2xl shadow-lg hover:bg-rose-700 transition-all transform active:scale-95 mt-4">
              تثبيت المصروف
            </button>
          </form>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex justify-between items-center shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
           <div>
              <p className="text-[10px] font-black text-rose-300 uppercase tracking-widest mb-1">إجمالي نفقات التشغيل</p>
              <h3 className="text-4xl font-black">{total.toLocaleString()} <span className="text-sm">د.م</span></h3>
           </div>
           <i className="fa-solid fa-vault text-5xl opacity-20"></i>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
          <header className="p-6 bg-slate-50 border-b flex justify-between items-center">
            <h3 className="font-black text-slate-800 m-0 text-sm">سجل المصاريف الأخيرة</h3>
            <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-full uppercase">عدد العمليات: {expenses.length}</span>
          </header>
          
          <div className="divide-y divide-slate-50">
            {expenses.map(exp => (
              <div key={exp.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-all">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center shrink-0">
                    <i className={`fa-solid ${exp.category === 'Transport' ? 'fa-car' : exp.category === 'Bills' ? 'fa-lightbulb' : 'fa-receipt'}`}></i>
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 text-sm">{exp.title}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{exp.category} • {exp.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-black text-rose-600 text-lg">{exp.amount} <span className="text-[10px]">د.م</span></span>
                  <button onClick={() => removeExp(exp.id)} className="text-slate-300 hover:text-rose-500 transition-colors"><i className="fa-solid fa-trash-can"></i></button>
                </div>
              </div>
            ))}
            {expenses.length === 0 && (
              <div className="p-20 text-center text-slate-300 italic font-bold">لا توجد مصاريف مسجلة</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeExpenses;
