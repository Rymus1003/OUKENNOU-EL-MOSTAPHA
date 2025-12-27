
import React, { useState, useEffect } from 'react';
import { api } from '../api';

const ClientLedger: React.FC = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [dossiers, setDossiers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getClients().then(setClients);
  }, []);

  const loadLedger = async (id: string) => {
    setLoading(true);
    const allDossiers = await api.getDossiers();
    const filtered = allDossiers.filter((d: any) => d.client_id.toString() === id);
    setDossiers(filtered);
    setLoading(false);
  };

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedClientId(id);
    if (id) loadLedger(id);
    else setDossiers([]);
  };

  const totalHT = dossiers.reduce((acc, d) => acc + (d.montant_total || 0), 0);
  const totalCollected = dossiers.reduce((acc, d) => acc + (d.avance || 0), 0);
  const totalRemaining = dossiers.reduce((acc, d) => acc + (d.reste || 0), 0);

  const printStatement = () => {
    const client = clients.find(c => c.id.toString() === selectedClientId);
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <html dir="rtl" lang="ar">
        <head>
          <title>كشف حساب موكل - ${client.nom_complet}</title>
          <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Tajawal', sans-serif; padding: 50px; color: #333; }
            .header { border-bottom: 2px solid #4f46e5; padding-bottom: 20px; margin-bottom: 40px; display: flex; justify-content: space-between; }
            .info { margin-bottom: 40px; background: #f8fafc; padding: 20px; border-radius: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #e2e8f0; padding: 12px; text-align: center; font-size: 13px; }
            th { background: #f1f5f9; font-weight: bold; }
            .total-row { background: #4f46e5; color: white; font-weight: bold; }
            .footer { margin-top: 50px; text-align: left; font-size: 10px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <div><h1>مكتب المحامي برو</h1><p>كشف حساب الوضعية المالية للموكل</p></div>
            <div style="text-align: left">التاريخ: ${new Date().toLocaleDateString('ar-MA')}</div>
          </div>
          <div class="info">
            <p><strong>الموكل:</strong> ${client.nom_complet}</p>
            <p><strong>رقم البطاقة (CIN):</strong> ${client.cin}</p>
            <p><strong>العنوان:</strong> ${client.adresse || '---'}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>رقم الملف</th>
                <th>موضوع القضية</th>
                <th>الأتعاب (TTC)</th>
                <th>المبالغ المؤداة</th>
                <th>الباقي</th>
              </tr>
            </thead>
            <tbody>
              ${dossiers.map(d => `
                <tr>
                  <td>${d.numero_mahakim}</td>
                  <td>${d.titre_affaire}</td>
                  <td>${Number(d.montant_total * 1.1 + (d.taxes || 0)).toLocaleString()} د.م</td>
                  <td>${Number(d.avance || 0).toLocaleString()} د.م</td>
                  <td style="color: ${d.reste > 0 ? 'red' : 'green'}">${Number(d.reste || 0).toLocaleString()} د.م</td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td colspan="3">المجموع الإجمالي المستحق</td>
                <td colspan="2" style="font-size: 18px">${totalRemaining.toLocaleString()} درهم مغربي</td>
              </tr>
            </tbody>
          </table>
          <p style="margin-top: 30px; font-weight: bold">ملاحظة: هذا الكشف يتضمن جميع الملفات المفتوحة والجارية.</p>
          <div class="footer">توقيع وخاتم الأستاذ المحامي</div>
          <script>window.print();</script>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 text-right" dir="rtl">
      <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100">
        <header className="flex justify-between items-center mb-10">
           <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-rose-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                <i className="fa-solid fa-book text-2xl"></i>
              </div>
              <div>
                <h3 className="text-3xl font-black text-slate-800">دفتر الأستاذ الموحد للموكل</h3>
                <p className="text-[10px] text-rose-600 font-bold uppercase tracking-widest mt-1">تتبع الوضعية المالية عبر جميع الملفات</p>
              </div>
           </div>
           {selectedClientId && dossiers.length > 0 && (
             <button 
                onClick={printStatement}
                className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-sm shadow-xl hover:bg-black transition-all flex items-center gap-3"
             >
                <i className="fa-solid fa-file-invoice-dollar text-rose-400"></i>
                استخراج كشف حساب رسمي
             </button>
           )}
        </header>

        <div className="mb-10 bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
           <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 pr-2">اختر الموكل لعرض كشفه المالي</label>
           <select 
              className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 text-lg font-bold focus:ring-4 focus:ring-rose-50 outline-none transition-all text-indigo-700"
              value={selectedClientId}
              onChange={handleClientChange}
           >
              <option value="">-- بحث عن موكل من القائمة --</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.nom_complet} ({c.cin})</option>)}
           </select>
        </div>

        {selectedClientId ? (
          <div className="space-y-8">
            {/* Financial Summary Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">إجمالي الأتعاب (HT)</p>
                  <p className="text-2xl font-black text-slate-800">{totalHT.toLocaleString()} <span className="text-xs">د.م</span></p>
               </div>
               <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100">
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">إجمالي المقبوضات</p>
                  <p className="text-2xl font-black text-emerald-700">{totalCollected.toLocaleString()} <span className="text-xs">د.م</span></p>
               </div>
               <div className="bg-rose-50 p-6 rounded-[2rem] border border-rose-100">
                  <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1">إجمالي الباقي</p>
                  <p className="text-2xl font-black text-rose-700">{totalRemaining.toLocaleString()} <span className="text-xs">د.م</span></p>
               </div>
            </div>

            {/* Dossiers List */}
            <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
               <table className="w-full text-right border-collapse">
                  <thead>
                     <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <th className="p-4">رقم الملف</th>
                        <th className="p-4">موضوع القضية</th>
                        <th className="p-4">المبلغ TTC</th>
                        <th className="p-4">الأداء</th>
                        <th className="p-4">الباقي</th>
                        <th className="p-4">الحالة</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {dossiers.map(d => (
                       <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-4 font-mono text-xs text-indigo-600 font-bold">{d.numero_mahakim}</td>
                          <td className="p-4 text-sm font-bold text-slate-800">{d.titre_affaire}</td>
                          <td className="p-4 text-sm font-bold text-slate-600">{Number(d.montant_total * 1.1 + (d.taxes || 0)).toLocaleString()}</td>
                          <td className="p-4 text-sm font-bold text-emerald-600">{Number(d.avance || 0).toLocaleString()}</td>
                          <td className="p-4 text-sm font-bold text-rose-600">{Number(d.reste || 0).toLocaleString()}</td>
                          <td className="p-4">
                             <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${d.statut === 'Jugé' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                {d.statut === 'Jugé' ? 'محكوم' : 'جارٍ'}
                             </span>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
               {dossiers.length === 0 && <div className="p-20 text-center text-slate-300 font-bold italic">لا توجد ملفات مرتبطة بهذا الموكل</div>}
            </div>
          </div>
        ) : (
          <div className="py-20 text-center opacity-30 flex flex-col items-center gap-4">
             <i className="fa-solid fa-magnifying-glass-dollar text-6xl"></i>
             <p className="font-bold">يرجى اختيار موكل لعرض كشف الحساب الموحد</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientLedger;
