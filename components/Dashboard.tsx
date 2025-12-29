
import React, { useState, useEffect } from 'react';
import { api } from '../api';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    active_cases: 0,
    today_hearings: 0,
    total_clients: 0,
    total_pending_fees: 0,
    total_collected_fees: 0,
    active_executions: 0,
    total_cases: 0
  });
  const [typeStats, setTypeStats] = useState({
    civil: 0,
    penal: 0,
    commercial: 0,
    family: 0,
    administrative: 0,
    labor: 0
  });
  const [recentHearings, setRecentHearings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    const [statsData, hearingsData, dossiersData] = await Promise.all([
      api.getStats(),
      api.getAudiences(),
      api.getDossiers()
    ]);
    
    if (statsData) {
      setStats({
        ...statsData,
        total_cases: dossiersData ? dossiersData.length : 0
      });
    }
    
    if (hearingsData) setRecentHearings(hearingsData.slice(0, 8));
    
    if (dossiersData) {
      const counts = {
        civil: dossiersData.filter((d: any) => d.type_affaire === 'Civil').length,
        penal: dossiersData.filter((d: any) => d.type_affaire === 'Penal').length,
        commercial: dossiersData.filter((d: any) => d.type_affaire === 'Commercial').length,
        family: dossiersData.filter((d: any) => d.type_affaire === 'Famille').length,
        administrative: dossiersData.filter((d: any) => d.type_affaire === 'Administratif').length,
        labor: dossiersData.filter((d: any) => d.type_affaire === 'Social').length,
      };
      setTypeStats(counts);
    }
    
    setLoading(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-8 text-right animate-in fade-in duration-700" dir="rtl">
      {/* Main Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'إجمالي الملفات', value: stats.total_cases, icon: 'fa-folder-tree', color: 'bg-slate-800' },
          { label: 'الملفات النشطة', value: stats.active_cases, icon: 'fa-folder-open', color: 'bg-indigo-600' },
          { label: 'جلسات اليوم', value: stats.today_hearings, icon: 'fa-calendar-check', color: 'bg-amber-500' },
          { label: 'ملفات التنفيذ', value: stats.active_executions, icon: 'fa-gavel', color: 'bg-emerald-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 group hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-2xl font-black text-slate-800">{stat.value}</h3>
              </div>
              <div className={`${stat.color} text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg`}>
                <i className={`fa-solid ${stat.icon} text-xl`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Case Types Breakdown Row - Updated to 5 columns on large screens */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'مدني', value: typeStats.civil, icon: 'fa-scale-balanced', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'جنائي', value: typeStats.penal, icon: 'fa-handcuffs', color: 'text-rose-600', bg: 'bg-rose-50' },
          { label: 'تجاري', value: typeStats.commercial, icon: 'fa-briefcase', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'أسرة', value: typeStats.family, icon: 'fa-people-roof', color: 'text-pink-600', bg: 'bg-pink-50' },
          { label: 'إداري', value: typeStats.administrative, icon: 'fa-building-columns', color: 'text-slate-600', bg: 'bg-slate-50' },
          { label: 'شغل', value: typeStats.labor, icon: 'fa-user-gear', color: 'text-cyan-600', bg: 'bg-cyan-50' },
        ].map((type, i) => (
          <div key={i} className={`${type.bg} p-5 rounded-3xl border border-white/50 shadow-sm flex items-center gap-4 transition-transform hover:scale-105`}>
             <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white ${type.color} shadow-sm`}>
                <i className={`fa-solid ${type.icon}`}></i>
             </div>
             <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{type.label}</p>
                <h4 className={`text-xl font-black ${type.color}`}>{type.value}</h4>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
          <h3 className="font-black text-slate-800 mb-8 text-lg flex items-center gap-3 relative z-10">
            <i className="fa-solid fa-calendar-day text-rose-500"></i>
            أجندة الجلسات القادمة
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
            {recentHearings.length > 0 ? recentHearings.map((h, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-[1.5rem] hover:bg-slate-50 transition-all border border-slate-100 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md">
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex flex-col items-center justify-center text-amber-600 border border-amber-100 shrink-0 font-black shadow-sm">
                   <span className="text-sm">{new Date(h.date_audience).getDate()}</span>
                   <span className="text-[8px] uppercase">{new Date(h.date_audience).toLocaleDateString('ar-MA', {month: 'short'})}</span>
                </div>
                <div className="overflow-hidden">
                   <p className="text-xs font-black text-slate-800 truncate">{h.titre_affaire}</p>
                   <p className="text-[9px] text-slate-400 mt-1 font-bold">
                     <i className="fa-solid fa-clock ml-1"></i>
                     {new Date(h.date_audience).toLocaleTimeString('ar-MA', {hour: '2-digit', minute: '2-digit'})}
                     <span className="mr-2 px-1.5 py-0.5 bg-slate-100 rounded text-slate-500">{h.tribunal}</span>
                   </p>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center py-20 opacity-30">
                <i className="fa-solid fa-calendar-xmark text-4xl mb-3"></i>
                <p className="text-sm font-bold">لا توجد جلسات قادمة مسجلة في النظام</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
