
import React, { useState, useEffect } from 'react';
import { api } from '../api';

const DailyCourtList: React.FC = () => {
  const [hearings, setHearings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTodayHearings();
  }, []);

  const loadTodayHearings = async () => {
    setLoading(true);
    const data = await api.getAudiences();
    const today = new Date().toISOString().split('T')[0];
    const filtered = data.filter((h: any) => h.date_audience.split('T')[0] === today);
    setHearings(filtered);
    setLoading(false);
  };

  const printAttendanceSheet = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const grouped = hearings.reduce((acc: any, h: any) => {
      const key = `${h.tribunal} - ${h.salle || 'قاعة غير محددة'}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(h);
      return acc;
    }, {});

    const html = `
      <html dir="rtl" lang="ar">
        <head>
          <title>لائحة الجلسات اليومية - ${new Date().toLocaleDateString('ar-MA')}</title>
          <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Tajawal', sans-serif; padding: 40px; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 30px; }
            .court-section { margin-bottom: 40px; page-break-inside: avoid; }
            .court-title { background: #f1f5f9; padding: 10px; border: 1px solid #000; font-weight: bold; margin-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #000; padding: 10px; text-align: center; font-size: 12px; }
            th { background: #eee; }
            .notes-cell { width: 200px; height: 40px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>مكتب الأستاذ المحامي: لائحة الحضور اليومية للمحاكم</h2>
            <p>بتاريخ: ${new Date().toLocaleDateString('ar-MA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          ${Object.keys(grouped).map(court => `
            <div class="court-section">
              <div class="court-title">${court}</div>
              <table>
                <thead>
                  <tr>
                    <th width="15%">رقم الملف</th>
                    <th width="20%">الموكل</th>
                    <th width="25%">موضوع القضية</th>
                    <th width="10%">الساعة</th>
                    <th>القرار المتخذ / ملاحظات المساعد</th>
                  </tr>
                </thead>
                <tbody>
                  ${grouped[court].map((h: any) => `
                    <tr>
                      <td>${h.numero_mahakim}</td>
                      <td>${h.client_name}</td>
                      <td>${h.titre_affaire}</td>
                      <td>${new Date(h.date_audience).toLocaleTimeString('ar-MA', {hour: '2-digit', minute: '2-digit'})}</td>
                      <td class="notes-cell"></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `).join('')}
          <script>window.print();</script>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-right" dir="rtl">
      <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100">
        <header className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <i className="fa-solid fa-clipboard-list text-2xl"></i>
            </div>
            <div>
              <h3 className="text-3xl font-black text-slate-800">مساعد الجلسات الميداني</h3>
              <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest mt-1">تجهيز لوائح الحضور للمساعدين القضائيين (Clercs)</p>
            </div>
          </div>
          <button 
            onClick={printAttendanceSheet}
            disabled={hearings.length === 0}
            className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black shadow-xl hover:bg-black transition-all flex items-center gap-3 disabled:opacity-30"
          >
            <i className="fa-solid fa-print"></i>
            طباعة لائحة اليوم
          </button>
        </header>

        {loading ? (
          <div className="p-20 text-center animate-pulse text-slate-400 font-bold">جاري تجميع جلسات اليوم...</div>
        ) : hearings.length > 0 ? (
          <div className="space-y-6">
            <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
               <p className="text-amber-800 font-bold text-sm">لديك <span className="text-xl font-black">{hearings.length}</span> جلسات مبرمجة لليوم في مختلف المحاكم.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {hearings.map(h => (
                 <div key={h.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
                       <i className="fa-solid fa-landmark"></i>
                    </div>
                    <div className="overflow-hidden">
                       <p className="text-[10px] font-black text-slate-400 uppercase truncate">{h.tribunal}</p>
                       <h5 className="font-black text-slate-800 text-sm truncate">{h.titre_affaire}</h5>
                       <p className="text-[9px] text-indigo-500 font-bold">رقم الملف: {h.numero_mahakim}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        ) : (
          <div className="py-32 text-center opacity-30 flex flex-col items-center gap-6">
             <i className="fa-solid fa-calendar-circle-exclamation text-8xl text-slate-300"></i>
             <p className="font-black text-xl">لا توجد جلسات مسجلة لتاريخ اليوم.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyCourtList;
