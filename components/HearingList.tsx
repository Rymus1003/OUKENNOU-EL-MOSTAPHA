
import React, { useState, useEffect } from 'react';
import { api } from '../api';

const HearingList: React.FC = () => {
  const [hearings, setHearings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHearings();
  }, []);

  const loadHearings = async () => {
    try {
      const data = await api.getAudiences();
      setHearings(data || []);
    } catch (error) {
      console.error('Error loading hearings:', error);
    } finally {
      setLoading(false);
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

  return (
    <div className="space-y-6 text-right" dir="rtl">
      <div className="w3-card-4 bg-white rounded-xl overflow-hidden shadow-lg border-r-4 border-orange-500">
        <header className="w3-container bg-orange-50 p-6 border-b flex justify-between items-center">
          <h3 className="font-bold text-orange-800 flex items-center gap-2 m-0">
            <i className="fa-solid fa-calendar-check"></i>
            أجندة الجلسات المبرمجة
          </h3>
          <button onClick={loadHearings} className="text-orange-600 hover:rotate-180 transition-transform duration-500">
            <i className="fa-solid fa-sync"></i>
          </button>
        </header>
        
        <div className="p-0">
          {loading ? (
            <div className="p-20 text-center text-slate-400">جاري تحميل الأجندة...</div>
          ) : hearings.length === 0 ? (
            <div className="p-20 text-center text-slate-400">لا توجد جلسات مبرمجة حالياً</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {hearings.map((hearing) => (
                <div key={hearing.id} className="p-6 hover:bg-orange-50/30 transition-colors flex flex-col md:flex-row gap-6">
                  <div className="md:w-48 flex flex-col items-center justify-center bg-white border border-orange-100 rounded-2xl p-4 shadow-sm">
                    <span className="text-orange-600 font-black text-xl">{formatTime(hearing.date_audience)}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase mt-1">{formatDate(hearing.date_audience).split('،')[0]}</span>
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono">
                        {hearing.numero_mahakim}
                      </span>
                      <h4 className="font-bold text-slate-800 text-lg">{hearing.titre_affaire}</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        <i className="fa-solid fa-door-open text-orange-400 w-5"></i>
                        <span>القاعة: <span className="font-bold text-slate-800">{hearing.salle || 'غير محددة'}</span></span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <i className="fa-solid fa-user-tie text-orange-400 w-5"></i>
                        <span>القاضي: <span className="font-bold text-slate-800">{hearing.juge_audience || '---'}</span></span>
                      </div>
                    </div>
                    {hearing.decision_intermediaire && (
                      <div className="mt-3 p-3 bg-slate-50 rounded-lg text-xs text-slate-500 italic border-r-2 border-slate-200">
                        <i className="fa-solid fa-quote-right ml-2 opacity-20"></i>
                        {hearing.decision_intermediaire}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center">
                    <a 
                      href={`https://www.mahakim.ma/Ar/Services/SuiviAffaires_vn/`} 
                      target="_blank" 
                      className="w3-button w3-white w3-border w3-border-orange w3-round-large text-xs font-bold hover:bg-orange-500 hover:text-white transition-all"
                    >
                      <i className="fa-solid fa-external-link ml-2"></i>
                      متابعة في محاكم
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HearingList;
