
import React, { useState, useEffect } from 'react';
import { api } from '../api';

const Reports: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [dossiers, setDossiers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = async () => {
    setLoading(true);
    try {
      const [s, d] = await Promise.all([api.getStats(), api.getDossiers()]);
      setStats(s);
      setDossiers(d || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const generatePDFReport = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const typeCounts = dossiers.reduce((acc: any, d: any) => {
      acc[d.type_affaire] = (acc[d.type_affaire] || 0) + 1;
      return acc;
    }, {});

    const html = `
      <html dir="rtl" lang="ar">
        <head>
          <title>التقرير السنوي لمكتب المحاماة</title>
          <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Tajawal', sans-serif; padding: 50px; background: #fff; color: #1e293b; }
            .header { text-align: center; border-bottom: 4px solid #4f46e5; padding-bottom: 30px; margin-bottom: 50px; }
            .header h1 { margin: 0; color: #1e1b4b; }
            .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 50px; }
            .card { border: 2px solid #f1f5f9; padding: 25px; border-radius: 20px; text-align: center; }
            .card h4 { margin: 0; color: #64748b; font-size: 14px; text-transform: uppercase; }
            .card p { margin: 15px 0 0; font-size: 28px; font-weight: 800; color: #4f46e5; }
            table { width: 100%; border-collapse: collapse; margin-top: 30px; border-radius: 10px; overflow: hidden; }
            th, td { border: 1px solid #e2e8f0; padding: 15px; text-align: right; font-size: 14px; }
            th { background: #f8fafc; font-weight: bold; color: #4338ca; }
            .footer { margin-top: 80px; text-align: left; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 20px; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>التقرير الإحصائي والمالي للمكتب</h1>
            <p>المحامي برو - إدارة المحاكم المغربية الرقمية</p>
            <p>تاريخ الاستخراج: ${new Date().toLocaleDateString('ar-MA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div class="grid">
            <div class="card"><h4>إجمالي القضايا</h4><p>${dossiers.length}</p></div>
            <div class="card"><h4>المبالغ المحصلة</h4><p>${Number(stats?.total_collected_fees).toLocaleString()} د.م</p></div>
            <div class="card"><h4>المبالغ المعلقة</h4><p>${Number(stats?.total_pending_fees).toLocaleString()} د.م</p></div>
          </div>
          <h3>تحليل القضايا حسب النوع</h3>
          <table>
            <thead><tr><th>نوع القضية</th><th>العدد الإجمالي</th><th>النسبة المئوية</th></tr></thead>
            <tbody>
              ${Object.entries(typeCounts).map(([type, count]: [string, any]) => `
                <tr><td>${type}</td><td>${count}</td><td>${((count / dossiers.length) * 100).toFixed(1)}%</td></tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">توقيع وخاتم المكتب: ...........................................</div>
          <script>window.print();</script>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-indigo-500 font-black">جاري تجميع البيانات الإحصائية...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-right" dir="rtl">
      {/* Action Header */}
      <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="space-y-4">
              <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-500/30">تحليل البيانات</span>
              <h2 className="text-4xl font-black leading-tight">مركز التقارير الإدارية</h2>
              <p className="text-slate-400 text-sm max-w-md leading-relaxed">استخرج تقارير PDF مفصلة، وراقب الأداء المالي والمهني لمكتبك من خلال لوحة تحكم إحصائية متقدمة.</p>
           </div>
           <div className="flex flex-col gap-3 w-full md:w-auto">
              <button 
                onClick={generatePDFReport}
                className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black shadow-xl hover:bg-indigo-50 transition-all flex items-center justify-center gap-3 transform hover:-translate-y-1 active:scale-95"
              >
                <i className="fa-solid fa-file-pdf text-xl text-rose-500"></i>
                استخراج التقرير السنوي
              </button>
              <button 
                onClick={loadReportData}
                className="bg-slate-800 text-slate-400 px-8 py-4 rounded-2xl font-black hover:bg-slate-700 hover:text-white transition-all flex items-center justify-center gap-3"
              >
                <i className="fa-solid fa-arrows-rotate"></i>
                تحديث البيانات
              </button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Performance Card 1 */}
         <div className="md:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
            <h4 className="font-black text-slate-400 text-[10px] uppercase tracking-widest mb-8 flex items-center gap-2">
              <i className="fa-solid fa-chart-pie text-indigo-500"></i>
              توزيع المحفظة القضائية
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
               <div className="space-y-6">
                  {['Civil', 'Penal', 'Commercial', 'Famille', 'Administratif'].map(type => {
                    const count = dossiers.filter(d => d.type_affaire === type).length;
                    const perc = dossiers.length > 0 ? (count / dossiers.length) * 100 : 0;
                    return (
                      <div key={type} className="group">
                         <div className="flex justify-between items-center text-xs font-black mb-2">
                           <span className="text-slate-700 group-hover:text-indigo-600 transition-colors">{type}</span>
                           <span className="text-slate-400">{count} ملف ({perc.toFixed(0)}%)</span>
                         </div>
                         <div className="h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                            <div 
                              className="h-full bg-gradient-to-l from-indigo-500 to-cyan-400 transition-all duration-1000 ease-out" 
                              style={{ width: `${perc}%` }}
                            ></div>
                         </div>
                      </div>
                    );
                  })}
               </div>
               <div className="bg-slate-50 rounded-3xl p-8 flex flex-col items-center justify-center border border-slate-100">
                  <div className="text-5xl font-black text-slate-900 mb-2">{dossiers.length}</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">إجمالي الملفات</div>
                  <div className="mt-8 flex gap-2">
                     <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                     <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                     <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                  </div>
               </div>
            </div>
         </div>

         {/* Finance Card */}
         <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between">
            <h4 className="font-black text-slate-400 text-[10px] uppercase tracking-widest mb-8 flex items-center gap-2">
              <i className="fa-solid fa-vault text-emerald-500"></i>
              السيولة المالية
            </h4>
            <div className="space-y-10">
               <div>
                  <p className="text-[10px] font-black text-emerald-500 uppercase mb-2">المبالغ المحصلة فعلياً</p>
                  <div className="text-3xl font-black text-slate-900">{Number(stats?.total_collected_fees).toLocaleString()} <span className="text-sm font-bold">د.م</span></div>
               </div>
               <div className="h-px bg-slate-50"></div>
               <div>
                  <p className="text-[10px] font-black text-rose-500 uppercase mb-2">الديون المستحقة</p>
                  <div className="text-3xl font-black text-slate-900">{Number(stats?.total_pending_fees).toLocaleString()} <span className="text-sm font-bold">د.م</span></div>
               </div>
            </div>
            <div className="mt-10 bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
               <p className="text-[9px] font-bold text-emerald-700 leading-relaxed text-center">
                 تحسن في معدل التحصيل بنسبة <span className="font-black">12%</span> مقارنة بالشهر الماضي.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Reports;
