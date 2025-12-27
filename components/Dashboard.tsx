
import React, { useState, useEffect } from 'react';
import { api } from '../api';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    active_cases: 0,
    today_hearings: 0,
    total_clients: 0,
    total_pending_fees: 0,
    total_collected_fees: 0,
    pending_tasks: 0,
    active_executions: 0
  });
  const [recentHearings, setRecentHearings] = useState<any[]>([]);
  const [recentCases, setRecentCases] = useState<any[]>([]);
  const [criticalTasks, setCriticalTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    const [statsData, hearingsData, dossiersData, tasksData] = await Promise.all([
      api.getStats(),
      api.getAudiences(),
      api.getDossiers(),
      api.getTasks()
    ]);
    if (statsData) setStats(statsData);
    if (hearingsData) setRecentHearings(hearingsData.slice(0, 5));
    if (dossiersData) setRecentCases(dossiersData.slice(0, 4));
    if (tasksData) setCriticalTasks(tasksData.filter((t: any) => t.priority === 'high' && t.status === 'pending').slice(0, 3));
    setLoading(false);
  };

  const financialProgress = stats.total_collected_fees + stats.total_pending_fees > 0 
    ? (stats.total_collected_fees / (stats.total_collected_fees + stats.total_pending_fees)) * 100 
    : 0;

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-8 text-right animate-in fade-in duration-700" dir="rtl">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'الملفات النشطة', value: stats.active_cases, icon: 'fa-folder-open', color: 'bg-indigo-600', trend: 'قيد المعالجة حالياً' },
          { label: 'جلسات اليوم', value: stats.today_hearings, icon: 'fa-calendar-check', color: 'bg-amber-500', trend: 'جدول المحاكم' },
          { label: 'ملفات التنفيذ', value: stats.active_executions, icon: 'fa-gavel', color: 'bg-emerald-600', trend: 'المفوضين القضائيين' },
          { label: 'مستحقات معلقة', value: `${Number(stats.total_pending_fees || 0).toLocaleString()} د.م`, icon: 'fa-hand-holding-dollar', color: 'bg-rose-600', trend: 'بذمة الموكلين' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-2xl font-black text-slate-800">{stat.value}</h3>
                <span className="text-[9px] font-bold text-slate-400 mt-2 block">{stat.trend}</span>
              </div>
              <div className={`${stat.color} text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-all`}>
                <i className={`fa-solid ${stat.icon} text-xl`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Critical Alerts Center (New Section) */}
          <div className="bg-rose-50 p-8 rounded-[2.5rem] border border-rose-100 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-32 h-32 bg-rose-200 rounded-full blur-3xl opacity-30 -ml-16 -mt-16"></div>
             <h3 className="font-black text-rose-900 mb-6 flex items-center gap-3 text-lg">
                <i className="fa-solid fa-triangle-exclamation animate-pulse"></i>
                مركز التنبيهات العاجلة
             </h3>
             <div className="space-y-4">
                {criticalTasks.map(task => (
                  <div key={task.id} className="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center border-r-4 border-rose-500">
                     <div className="flex items-center gap-3">
                        <i className="fa-solid fa-fire text-rose-500"></i>
                        <span className="text-xs font-black text-slate-800">{task.title}</span>
                     </div>
                     <span className="text-[9px] font-bold text-rose-500 bg-rose-50 px-3 py-1 rounded-full uppercase">أولوية قصوى</span>
                  </div>
                ))}
                {stats.today_hearings > 0 && (
                  <div className="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center border-r-4 border-amber-500">
                     <div className="flex items-center gap-3">
                        <i className="fa-solid fa-landmark text-amber-500"></i>
                        <span className="text-xs font-black text-slate-800">لديك {stats.today_hearings} جلسات مبرمجة لليوم</span>
                     </div>
                     <button className="text-[9px] font-black text-amber-600 hover:underline uppercase">عرض الأجندة</button>
                  </div>
                )}
                {criticalTasks.length === 0 && stats.today_hearings === 0 && (
                   <div className="text-center py-6 text-rose-400 italic text-sm font-bold">لا توجد تنبيهات عاجلة في الوقت الحالي.</div>
                )}
             </div>
          </div>

          {/* Financial Performance */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-16 -mt-16"></div>
             <div className="flex justify-between items-center mb-10 relative z-10">
                <h3 className="font-black text-slate-800 flex items-center gap-3 m-0 text-xl">
                  <i className="fa-solid fa-chart-line text-emerald-500"></i>
                  مؤشر التحصيل المالي TTC
                </h3>
                <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-full border border-emerald-100 uppercase">مباشر</span>
             </div>
             <div className="space-y-8 relative z-10">
                <div className="flex justify-between items-end">
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">إجمالي المبالغ المحصلة</p>
                      <p className="text-4xl font-black text-slate-900">{Number(stats.total_collected_fees).toLocaleString()} <span className="text-sm font-bold text-slate-400">د.م</span></p>
                   </div>
                   <div className="text-left">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">نسبة التحصيل</p>
                      <p className="text-3xl font-black text-emerald-600">{financialProgress.toFixed(1)}%</p>
                   </div>
                </div>
                <div className="h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                   <div 
                      className="h-full bg-gradient-to-l from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${financialProgress}%` }}
                   ></div>
                </div>
             </div>
          </div>
        </div>

        {/* Sidebar Sidebar */}
        <div className="space-y-8">
           {/* Agenda Widget */}
           <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
              <h3 className="font-black text-slate-800 mb-8 text-sm flex items-center gap-3">
                <i className="fa-solid fa-calendar-day text-rose-500"></i>
                أجندة الجلسات القادمة
              </h3>
              <div className="space-y-5">
                {recentHearings.length > 0 ? recentHearings.map((h, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-[1.5rem] hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                    <div className="w-12 h-12 bg-amber-50 rounded-2xl flex flex-col items-center justify-center text-amber-600 border border-amber-100 shrink-0 font-black shadow-sm">
                       <span className="text-sm">{new Date(h.date_audience).getDate()}</span>
                       <span className="text-[8px] uppercase">{new Date(h.date_audience).toLocaleDateString('ar-MA', {month: 'short'})}</span>
                    </div>
                    <div className="overflow-hidden">
                       <p className="text-xs font-black text-slate-800 truncate" title={h.titre_affaire}>{h.titre_affaire}</p>
                       <p className="text-[9px] text-slate-400 mt-1 font-bold">
                         <i className="fa-solid fa-clock ml-1"></i>
                         {new Date(h.date_audience).toLocaleTimeString('ar-MA', {hour: '2-digit', minute: '2-digit'})}
                       </p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-10 opacity-30">
                    <i className="fa-solid fa-calendar-xmark text-3xl mb-3"></i>
                    <p className="text-[10px] font-bold">لا توجد جلسات مجدولة</p>
                  </div>
                )}
              </div>
           </div>

           {/* Quick Access Members */}
           <div className="bg-indigo-600 p-8 rounded-[2rem] shadow-xl text-white">
              <h4 className="font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                 <i className="fa-solid fa-users"></i>
                 فريق عمل المكتب
              </h4>
              <div className="flex -space-x-3 space-x-reverse overflow-hidden mb-6">
                {[1,2,3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-indigo-600 bg-white/20 flex items-center justify-center font-black text-xs">U{i}</div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-indigo-600 bg-indigo-800 flex items-center justify-center text-[10px] font-black">+</div>
              </div>
              <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold py-3 rounded-xl transition-all text-xs">توزيع المهام</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
