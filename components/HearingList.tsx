
import React, { useState, useEffect } from 'react';
import { api } from '../api';
import WhatsAppNotifier from './WhatsAppNotifier';

type ViewMode = 'list' | 'calendar';

const HearingList: React.FC = () => {
  const [hearings, setHearings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filterDate, setFilterDate] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadHearings();
  }, []);

  const loadHearings = async () => {
    try {
      setLoading(true);
      const data = await api.getAudiences();
      setHearings(data || []);
    } catch (error) {
      console.error('Error loading hearings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الجلسة؟')) {
      try {
        await api.deleteAudience(id);
        await loadHearings();
      } catch (error) {
        alert('حدث خطأ أثناء الحذف');
      }
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ar-MA', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('ar-MA', { hour: '2-digit', minute: '2-digit' });
  };

  const getHearingStatus = (dateStr: string) => {
    const hearingDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const hDateOnly = new Date(hearingDate);
    hDateOnly.setHours(0, 0, 0, 0);

    if (hDateOnly.getTime() === today.getTime()) {
      return { label: 'اليوم', color: 'bg-emerald-500', icon: 'fa-circle-dot animate-pulse' };
    } else if (hearingDate > today) {
      return { label: 'قادمة', color: 'bg-blue-500', icon: 'fa-clock-rotate-left' };
    } else {
      return { label: 'سابقة', color: 'bg-slate-400', icon: 'fa-check-double' };
    }
  };

  // Calendar Logic
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const monthYearStr = currentDate.toLocaleDateString('ar-MA', { month: 'long', year: 'numeric' });
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysArr = [];
  const totalDays = daysInMonth(year, month);
  const startOffset = firstDayOfMonth(year, month);

  for (let i = 0; i < startOffset; i++) daysArr.push(null);
  for (let d = 1; d <= totalDays; d++) daysArr.push(d);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getHearingsForDay = (day: number) => {
    return hearings.filter(h => {
      const hDate = new Date(h.date_audience);
      return hDate.getDate() === day && hDate.getMonth() === month && hDate.getFullYear() === year;
    });
  };

  const dayNames = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];

  const filteredHearings = hearings.filter(h => {
    const hDateStr = new Date(h.date_audience).toISOString().split('T')[0];
    const matchesDate = filterDate ? hDateStr === filterDate : true;
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      h.titre_affaire.toLowerCase().includes(term) || 
      h.client_name.toLowerCase().includes(term) ||
      h.numero_mahakim.toLowerCase().includes(term) ||
      h.tribunal.toLowerCase().includes(term);
    
    return matchesDate && matchesSearch;
  });

  return (
    <div className="space-y-6 text-right" dir="rtl">
      <div className="flex flex-col lg:flex-row justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100 gap-4">
        <div className="flex gap-2 p-1 bg-slate-100 rounded-lg w-full lg:w-auto">
          <button 
            onClick={() => setViewMode('list')}
            className={`flex-1 lg:flex-none px-6 py-2 rounded-md font-bold text-sm transition-all ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}
          >
            <i className="fa-solid fa-list-ul ml-2"></i>
            قائمة
          </button>
          <button 
            onClick={() => setViewMode('calendar')}
            className={`flex-1 lg:flex-none px-6 py-2 rounded-md font-bold text-sm transition-all ${viewMode === 'calendar' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}
          >
            <i className="fa-solid fa-calendar-alt ml-2"></i>
            تقويم
          </button>
        </div>

        <div className="flex flex-1 items-center gap-4 w-full">
          {viewMode === 'list' && (
            <>
              <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2">
                <i className="fa-solid fa-magnifying-glass text-indigo-500"></i>
                <input 
                  type="text" 
                  className="bg-transparent border-none outline-none text-sm font-medium text-slate-700 w-full"
                  placeholder="ابحث بالموكل، الملف، المحكمة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                <i className="fa-solid fa-calendar-day text-orange-500"></i>
                <input 
                  type="date" 
                  className="bg-transparent border-none outline-none text-xs font-bold text-slate-600 cursor-pointer"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
                {filterDate && (
                  <button onClick={() => setFilterDate('')} className="text-slate-400 hover:text-rose-500">
                    <i className="fa-solid fa-circle-xmark"></i>
                  </button>
                )}
              </div>
            </>
          )}
          <button onClick={loadHearings} className="w-10 h-10 flex items-center justify-center text-indigo-600 hover:rotate-180 transition-transform duration-500 bg-indigo-50 rounded-xl shrink-0">
            <i className="fa-solid fa-sync"></i>
          </button>
        </div>
      </div>

      <div className="w3-card-4 bg-white rounded-3xl overflow-hidden shadow-lg border-r-4 border-orange-500">
        <header className="bg-orange-50 p-6 border-b flex justify-between items-center">
          <h3 className="font-black text-orange-900 flex items-center gap-2 m-0 text-lg">
            <i className="fa-solid fa-calendar-check text-xl"></i>
            {viewMode === 'list' 
              ? (filterDate ? `جلسات يوم ${new Date(filterDate).toLocaleDateString('ar-MA')}` : 'أجندة الجلسات')
              : `التقويم - ${monthYearStr}`}
          </h3>
          {viewMode === 'calendar' && (
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="w-8 h-8 rounded-full hover:bg-orange-200 text-orange-700 transition-colors"><i className="fa-solid fa-chevron-right"></i></button>
              <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 text-xs font-bold bg-white border border-orange-200 rounded-lg text-orange-700 hover:bg-orange-100 transition-colors">اليوم</button>
              <button onClick={nextMonth} className="w-8 h-8 rounded-full hover:bg-orange-200 text-orange-700 transition-colors"><i className="fa-solid fa-chevron-left"></i></button>
            </div>
          )}
        </header>
        
        <div className="p-0">
          {loading ? (
            <div className="p-20 text-center text-slate-400 animate-pulse font-bold">جاري تحميل البيانات...</div>
          ) : viewMode === 'list' ? (
            <div className="divide-y divide-slate-100">
              {filteredHearings.length === 0 ? (
                <div className="p-20 text-center text-slate-400 font-bold italic">
                  <i className="fa-solid fa-calendar-xmark text-4xl mb-4 block opacity-10"></i>
                  لا توجد جلسات مطابقة
                </div>
              ) : (
                filteredHearings.map((hearing) => {
                  const status = getHearingStatus(hearing.date_audience);
                  return (
                    <div key={hearing.id} className="p-6 hover:bg-slate-50 transition-all flex flex-col md:flex-row gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300 relative group">
                      <div className="md:w-40 flex flex-col items-center justify-center bg-white border border-slate-100 rounded-2xl p-4 shadow-sm h-fit relative">
                        <span className="text-orange-600 font-black text-2xl">{formatTime(hearing.date_audience)}</span>
                        <span className="text-[10px] text-slate-400 font-black uppercase mt-1 tracking-widest">{formatDate(hearing.date_audience).split('،')[0]}</span>
                        <div className={`absolute -top-2 -right-2 px-2 py-0.5 rounded-full ${status.color} text-white text-[8px] font-black flex items-center gap-1 shadow-sm`}>
                          <i className={`fa-solid ${status.icon}`}></i>
                          {status.label}
                        </div>
                      </div>
                      
                      <div className="flex-1 space-y-4">
                        <div>
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="bg-slate-900 text-white text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-widest">
                              {hearing.numero_mahakim}
                            </span>
                            <span className="bg-amber-100 text-amber-700 text-[9px] font-black px-2 py-0.5 rounded-lg uppercase">
                              {hearing.tribunal}
                            </span>
                          </div>
                          <h4 className="font-black text-slate-800 text-xl mt-2">{hearing.titre_affaire}</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100">
                            <i className="fa-solid fa-door-open text-orange-400"></i>
                            <span className="text-slate-500 font-bold text-xs">القاعة: <span className="text-slate-800">{hearing.salle || '---'}</span></span>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100">
                            <i className="fa-solid fa-user-tie text-orange-400"></i>
                            <span className="text-slate-500 font-bold text-xs">الموكل: <span className="text-slate-800 font-black">{hearing.client_name || '---'}</span></span>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100">
                            <i className="fa-solid fa-gavel text-orange-400"></i>
                            <span className="text-slate-500 font-bold text-xs">القاضي: <span className="text-slate-800 font-black">{hearing.juge_audience || '---'}</span></span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 justify-center shrink-0">
                        <WhatsAppNotifier 
                          clientName={hearing.client_name}
                          phone={hearing.client_phone || ''}
                          hearingDate={hearing.date_audience}
                          court={hearing.tribunal || ''}
                          caseNumber={hearing.numero_mahakim}
                        />
                        <div className="flex gap-2">
                           <a 
                            href={`https://www.mahakim.ma/Ar/Services/SuiviAffaires_vn/`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-[10px] font-bold hover:bg-slate-50 transition-all shadow-sm"
                          >
                            <i className="fa-solid fa-external-link"></i>
                            محاكم
                          </a>
                          <button 
                            onClick={() => handleDelete(hearing.id.toString())}
                            className="w-8 h-8 flex items-center justify-center text-rose-500 bg-rose-50 hover:bg-rose-500 hover:text-white rounded-lg transition-all shadow-sm"
                            title="حذف الجلسة"
                          >
                            <i className="fa-solid fa-trash-can text-xs"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            <div className="p-4 bg-white animate-in zoom-in-95 duration-300">
              <div className="grid grid-cols-7 border-b border-slate-100 mb-2">
                {dayNames.map(d => (
                  <div key={d} className="p-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-px bg-slate-100 border border-slate-100 rounded-2xl overflow-hidden shadow-inner">
                {daysArr.map((day, idx) => {
                  const dayHearings = day ? getHearingsForDay(day) : [];
                  const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
                  
                  return (
                    <div 
                      key={idx} 
                      className={`min-h-[140px] bg-white p-2 flex flex-col gap-1 transition-all ${day ? 'hover:bg-orange-50/20' : 'bg-slate-50/50'}`}
                    >
                      {day && (
                        <>
                          <div className="flex justify-between items-center mb-2">
                            <span className={`w-8 h-8 flex items-center justify-center rounded-xl text-xs font-black ${isToday ? 'bg-orange-500 text-white shadow-lg shadow-orange-200 scale-110' : 'text-slate-400'}`}>
                              {day}
                            </span>
                            {dayHearings.length > 0 && (
                              <span className="text-[8px] font-black text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded-lg border border-orange-100">
                                {dayHearings.length}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col gap-1 overflow-y-auto max-h-[90px] custom-scrollbar">
                            {dayHearings.map(h => (
                              <div key={h.id} className="text-[8px] bg-slate-50 text-slate-700 p-1.5 rounded-lg border-r-4 border-indigo-500 font-bold truncate transition-all hover:bg-white hover:shadow-sm" title={`${formatTime(h.date_audience)} - ${h.titre_affaire}`}>
                                <span className="text-orange-600 block mb-0.5">{formatTime(h.date_audience).split(' ')[0]}</span>
                                {h.titre_affaire}
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HearingList;
