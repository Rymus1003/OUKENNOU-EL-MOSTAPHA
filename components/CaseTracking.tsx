
import React, { useState, useEffect } from 'react';
import { api } from '../api';

interface CaseTrackingProps {
  onAddHearing?: (dossierId: string) => void;
  onViewDetails?: (view: any, dossierId: string) => void;
}

const CaseTracking: React.FC<CaseTrackingProps> = ({ onAddHearing, onViewDetails }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadLinkedData();
  }, []);

  const loadLinkedData = async () => {
    try {
      setLoading(true);
      const [dossiers, hearings] = await Promise.all([
        api.getDossiers(),
        api.getAudiences()
      ]);

      const linked = dossiers.map((d: any) => ({
        ...d,
        hearings: hearings.filter((h: any) => h.dossier_id === d.id)
                          .sort((a: any, b: any) => new Date(b.date_audience).getTime() - new Date(a.date_audience).getTime())
      }));

      setData(linked);
    } catch (error) {
      console.error('Error loading linked data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter(item => 
    item.numero_mahakim.includes(searchTerm) || 
    item.titre_affaire.includes(searchTerm) ||
    (item.client_name && item.client_name.includes(searchTerm))
  );

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '---';
    return new Date(dateStr).toLocaleDateString('ar-MA', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Search Header */}
      <div className="w3-card-4 bg-white p-6 rounded-xl border-r-4 border-emerald-500 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex items-center gap-4 flex-1 w-full">
            <label className="min-w-[150px] flex items-center gap-2 font-bold text-slate-700">
              <i className="fa-solid fa-folder-tree text-emerald-500"></i>
              <span>تصفية الملفات:</span>
            </label>
            <input 
              type="text" 
              className="flex-1 border-b-2 border-slate-100 focus:border-emerald-500 outline-none py-2 bg-transparent font-medium transition-all"
              placeholder="ابحث برقم الملف، الموكل، أو موضوع القضية..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={loadLinkedData} className="bg-slate-50 text-emerald-600 px-4 py-2 rounded-lg hover:bg-emerald-50 font-bold border border-emerald-100">
            تحديث البيانات
          </button>
        </div>
      </div>

      {/* Integrated Management Table */}
      <div className="w3-card-4 bg-white rounded-xl overflow-hidden shadow-lg border-t-2 border-emerald-50">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 text-center animate-pulse text-emerald-500 font-bold">جاري المعالجة...</div>
          ) : (
            <table className="w-full text-right border-collapse min-w-[1100px]">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="p-5 text-sm font-bold w-48">الملف (رقم محاكم)</th>
                  <th className="p-5 text-sm font-bold">موضوع القضية والموكل</th>
                  <th className="p-5 text-sm font-bold w-80 bg-slate-800">سجل الجلسات (آخر 3)</th>
                  <th className="p-5 text-sm font-bold w-40 text-center">إجراءات سريعة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors align-top">
                    <td className="p-5 border-l border-slate-50">
                      <button 
                        onClick={() => window.location.href.includes('localhost') ? alert('Details View Triggered') : null} 
                        className="font-mono text-sm font-bold text-indigo-700 hover:underline"
                      >
                         {item.numero_mahakim}
                      </button>
                      <div className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-tighter">
                        <i className="fa-solid fa-landmark ml-1"></i>
                        {item.tribunal}
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="font-bold text-slate-800 text-lg">{item.titre_affaire}</div>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                          {item.client_name || 'غير محدد'}
                        </span>
                        <span className="text-[10px] text-slate-400 border border-slate-100 px-2 py-1 rounded">
                          {item.type_affaire}
                        </span>
                      </div>
                    </td>
                    <td className="p-0 bg-slate-50/40">
                      {item.hearings.length > 0 ? (
                        <div className="flex flex-col">
                          {item.hearings.slice(0, 3).map((h: any, idx: number) => (
                            <div key={idx} className="p-3 border-b border-white last:border-0 flex justify-between items-center group/row hover:bg-white transition-all">
                                <div className="flex items-center gap-2">
                                  <i className="fa-solid fa-clock text-[10px] text-orange-400"></i>
                                  <span className="text-xs font-black text-slate-700">{formatDate(h.date_audience)}</span>
                                </div>
                                <div className="text-[9px] text-slate-400 italic truncate max-w-[120px]">
                                  {h.decision_intermediaire || 'لا قرار مسجل'}
                                </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 text-center text-xs text-slate-300 italic">لم تتم جدولة أي جلسة</div>
                      )}
                    </td>
                    <td className="p-5">
                      <div className="flex flex-col gap-2">
                        <button 
                          onClick={() => {
                            // This logic is linked to App.tsx through parent state
                            const app = (window as any)._app_navigate;
                            if(app) app('dossier-details', item.id.toString());
                            else {
                              // Direct navigation workaround if state not shared
                              const event = new CustomEvent('nav-to-details', { detail: item.id.toString() });
                              window.dispatchEvent(event);
                            }
                          }}
                          className="w-full py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-lg transition-all text-xs font-bold flex items-center justify-center gap-2"
                        >
                          <i className="fa-solid fa-eye"></i>
                          عرض التفاصيل
                        </button>
                        <button 
                          onClick={() => onAddHearing?.(item.id)}
                          className="w-full py-2 bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white rounded-lg transition-all text-xs font-bold flex items-center justify-center gap-2 border border-orange-100"
                        >
                          <i className="fa-solid fa-calendar-plus"></i>
                          جدولة جلسة
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaseTracking;
