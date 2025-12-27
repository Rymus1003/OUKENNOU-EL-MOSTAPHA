
import React, { useState, useEffect } from 'react';
import { api } from '../api';

const AnalyticsReport: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getStats().then(setStats).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-20 text-center animate-pulse font-black text-slate-400">جاري إعداد التقرير التحليلي...</div>;

  const cards = [
    { title: 'كفاءة التحصيل المالي', val: `${((stats.total_collected_fees / (stats.total_collected_fees + stats.total_pending_fees)) * 100).toFixed(1)}%`, icon: 'fa-chart-pie', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'متوسط القضايا لكل موكل', val: (stats.active_cases / stats.total_clients).toFixed(1), icon: 'fa-users-between-lines', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'ضغط العمل الحالي', val: `${stats.pending_tasks} مهمة`, icon: 'fa-fire-flame-curved', color: 'text-rose-600', bg: 'bg-rose-50' },
    { title: 'ملفات التنفيذ النشطة', val: stats.active_executions, icon: 'fa-gavel', color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 text-right p-4 md:p-0" dir="rtl">
      <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50 rounded-full blur-[120px] -mr-48 -mt-48 opacity-40"></div>
        
        <header className="flex flex-col md:flex-row justify-between items-end mb-16 relative z-10 gap-8">
          <div className="space-y-4">
             <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white shadow-2xl rotate-6 transform hover:rotate-0 transition-transform">
                <i className="fa-solid fa-square-poll-vertical text-3xl text-indigo-400"></i>
             </div>
             <h2 className="text-5xl font-black text-slate-900 tracking-tight">التقرير الاستراتيجي للمكتب</h2>
             <p className="text-slate-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                مؤشرات الأداء المهني والمالي (KPIs)
             </p>
          </div>
          <button onClick={() => window.print()} className="bg-slate-50 border border-slate-200 px-8 py-4 rounded-2xl font-black text-xs hover:bg-slate-100 transition-all flex items-center gap-3">
             <i className="fa-solid fa-print"></i>
             طباعة التقرير كاملاً
          </button>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {cards.map((card, i) => (
            <div key={i} className={`${card.bg} p-8 rounded-[2.5rem] border border-white/50 shadow-sm hover:shadow-xl transition-all group`}>
               <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 bg-white rounded-2xl flex items-center justify-center ${card.color} shadow-sm group-hover:scale-110 transition-transform`}>
                    <i className={`fa-solid ${card.icon} text-xl`}></i>
                  </div>
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{card.title}</p>
               <h4 className={`text-3xl font-black ${card.color}`}>{card.val}</h4>
            </div>
          ))}
        </section>

        <section className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
           <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -ml-16 -mb-16"></div>
              <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                 <i className="fa-solid fa-coins text-emerald-400"></i>
                 الخلاصة المالية (TTC)
              </h3>
              <div className="space-y-8">
                 <div className="flex justify-between items-end border-b border-white/10 pb-6">
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase mb-1">المداخيل الإجمالية</p>
                       <p className="text-3xl font-black">{Number(stats.total_collected_fees).toLocaleString()} <span className="text-xs">د.م</span></p>
                    </div>
                    <div className="text-left">
                       <p className="text-[10px] font-black text-slate-400 uppercase mb-1">الديون العالقة</p>
                       <p className="text-3xl font-black text-rose-400">{Number(stats.total_pending_fees).toLocaleString()} <span className="text-xs">د.م</span></p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4 bg-white/5 p-6 rounded-2xl border border-white/5">
                    <i className="fa-solid fa-circle-info text-indigo-400 text-xl"></i>
                    <p className="text-xs font-medium leading-relaxed opacity-70 italic">
                       يعتمد هذا التحليل على المبالغ الصافية (HT) مضافاً إليها ضريبة 10% والرسوم القضائية المسجلة في النظام.
                    </p>
                 </div>
              </div>
           </div>

           <div className="space-y-6">
              <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                 <i className="fa-solid fa-bolt-lightning text-amber-500"></i>
                 التوصيات الاستراتيجية
              </h3>
              <div className="space-y-4">
                 {[
                   { t: 'تحسين التحصيل', d: 'هناك مبالغ عالقة تتجاوز 40% من الأتعاب. ينصح بتفعيل مسطرة الإنذار التلقائي.' },
                   { t: 'توزيع الجلسات', d: 'كثافة الجلسات تتركز في منتصف الأسبوع. ينصح بتفويض بعض المهام الإدارية للمساعدين.' },
                   { t: 'الأرشيف الرقمي', d: 'تمت أرشفة 65% من الملفات. ينصح بإتمام أرشفة الملفات المحكومة نهائياً.' }
                 ].map((rec, i) => (
                   <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-indigo-200 transition-all flex gap-5">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center font-black text-slate-400 shrink-0">{i+1}</div>
                      <div>
                         <h5 className="font-black text-slate-800 text-sm mb-1">{rec.t}</h5>
                         <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{rec.d}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        <footer className="mt-20 pt-10 border-t border-slate-50 text-center">
           <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">AvocatManager Pro Analytical Engine • 2024</p>
        </footer>
      </div>
    </div>
  );
};

export default AnalyticsReport;
