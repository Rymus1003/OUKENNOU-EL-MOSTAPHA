
import React, { useState, useEffect } from 'react';
import { api } from '../api';

interface CaseListProps {
  onQuickAction?: (view: any, dossierId: string) => void;
}

const CaseList: React.FC<CaseListProps> = ({ onQuickAction }) => {
  const [dossiers, setDossiers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadDossiers();
  }, []);

  const loadDossiers = async () => {
    try {
      setLoading(true);
      const data = await api.getDossiers();
      setDossiers(data || []);
    } catch (error) {
      console.error('Error loading dossiers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async (id: string) => {
    if (window.confirm('هل أنت متأكد من رغبتك في أرشفة هذا الملف؟')) {
      try {
        await api.updateDossierStatus(id, 'Archivé');
        await loadDossiers();
      } catch (error) {
        alert('حدث خطأ أثناء محاولة أرشفة الملف');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('تنبيه: حذف الملف سيؤدي لحذف كافة الجلسات المرتبطة به بشكل نهائي. هل أنت متأكد؟')) {
      try {
        await api.deleteDossier(id);
        await loadDossiers();
      } catch (error) {
        alert('حدث خطأ أثناء محاولة حذف الملف');
      }
    }
  };

  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'Civil': return { label: 'مدني', icon: 'fa-scale-balanced', color: 'text-indigo-600', bg: 'bg-indigo-50' };
      case 'Penal': return { label: 'جنائي', icon: 'fa-gavel', color: 'text-rose-600', bg: 'bg-rose-50' };
      case 'Commercial': return { label: 'تجاري', icon: 'fa-briefcase', color: 'text-emerald-600', bg: 'bg-emerald-50' };
      case 'Famille': return { label: 'أسرة', icon: 'fa-people-roof', color: 'text-orange-600', bg: 'bg-orange-50' };
      case 'Administratif': return { label: 'إداري', icon: 'fa-building-columns', color: 'text-slate-600', bg: 'bg-slate-50' };
      default: return { label: type, icon: 'fa-folder', color: 'text-gray-600', bg: 'bg-gray-50' };
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'En cours': return { label: 'قيد المعالجة', icon: 'fa-hourglass-half', color: 'text-amber-600', bg: 'bg-amber-50' };
      case 'Jugé': return { label: 'محكوم', icon: 'fa-circle-check', color: 'text-emerald-600', bg: 'bg-emerald-50' };
      case 'Archivé': return { label: 'مؤرشف', icon: 'fa-box-archive', color: 'text-slate-500', bg: 'bg-slate-100' };
      default: return { label: status, icon: 'fa-circle-info', color: 'text-blue-600', bg: 'bg-blue-50' };
    }
  };

  const handlePrint = (dossier: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const html = `
      <html dir="rtl" lang="ar">
        <head>
          <title>بطاقة ملف - ${dossier.numero_mahakim}</title>
          <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Tajawal', sans-serif; padding: 40px; color: #333; }
            .header { border-bottom: 2px solid #6366f1; padding-bottom: 20px; margin-bottom: 40px; display: flex; justify-content: space-between; }
            .section { margin-bottom: 30px; }
            .section-title { font-weight: bold; color: #6366f1; border-right: 4px solid #6366f1; padding-right: 10px; margin-bottom: 15px; }
            table { width: 100%; border-collapse: collapse; }
            td { padding: 12px; border: 1px solid #eee; }
            .label { font-weight: bold; width: 150px; background: #f8fafc; }
            .footer { margin-top: 50px; text-align: center; font-size: 10px; color: #94a3b8; }
          </style>
        </head>
        <body>
          <div class="header">
            <div><h1>مكتب المحاماة الرقمي</h1><p>بطاقة معلومات ملف قضائي</p></div>
            <div style="text-align: left">تاريخ الطبع: ${new Date().toLocaleDateString('ar-MA')}</div>
          </div>
          <div class="section">
            <div class="section-title">معلومات الملف</div>
            <table>
              <tr><td class="label">رقم الملف (محاكم)</td><td>${dossier.numero_mahakim}</td><td class="label">نوع القضية</td><td>${dossier.type_affaire}</td></tr>
              <tr><td class="label">موضوع القضية</td><td colspan="3">${dossier.titre_affaire}</td></tr>
              <tr><td class="label">المحكمة</td><td>${dossier.tribunal}</td><td class="label">القاضي المقرر</td><td>${dossier.juge || '---'}</td></tr>
            </table>
          </div>
          <div class="section">
            <div class="section-title">أطراف النزاع</div>
            <table>
              <tr><td class="label">الموكل</td><td>${dossier.client_name} (ID: ${dossier.client_id})</td><td class="label">رقم البطاقة (CIN)</td><td>${dossier.client_cin || '---'}</td></tr>
            </table>
          </div>
          <div class="section">
            <div class="section-title">الوضعية المالية</div>
            <table>
              <tr><td class="label">إجمالي الأتعاب</td><td>${dossier.montant_total || 0} د.م</td><td class="label">الباقي بذمة الموكل</td><td style="color:red; font-weight:bold">${dossier.reste || 0} د.م</td></tr>
            </table>
          </div>
          <div class="footer">هذه الوثيقة مستخرجة آلياً من نظام AvocatManager Pro وتعتبر للإرشاد فقط</div>
          <script>window.print();</script>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const filteredDossiers = dossiers.filter(d => {
    const term = searchTerm.toLowerCase();
    return (
      (d.numero_mahakim && d.numero_mahakim.toLowerCase().includes(term)) || 
      (d.titre_affaire && d.titre_affaire.toLowerCase().includes(term)) ||
      (d.client_name && d.client_name.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6 text-right" dir="rtl">
      <div className="w3-card-4 bg-white p-6 rounded-xl border-r-4 border-indigo-500 shadow-sm flex flex-col md:flex-row items-center gap-4 transition-all hover:shadow-md">
        <div className="flex items-center gap-4 flex-1 w-full">
          <i className="fa-solid fa-magnifying-glass text-indigo-500"></i>
          <input 
            type="text" 
            className="flex-1 border-b-2 border-slate-100 focus:border-indigo-500 outline-none py-2 bg-transparent font-medium transition-colors"
            placeholder="البحث باسم الموكل، رقم الملف، أو موضوع القضية..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-xs text-slate-400 font-bold bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
          عدد الملفات: <span className="text-indigo-600">{filteredDossiers.length}</span>
        </div>
      </div>

      <div className="w3-card-4 bg-white rounded-xl overflow-hidden shadow-lg border border-slate-100">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 text-center font-bold text-slate-400 animate-pulse">جاري تحميل الملفات...</div>
          ) : (
            <table className="w-full text-right border-collapse min-w-[1100px]">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="p-5 text-sm font-bold">الملف (الرقم والموضوع)</th>
                  <th className="p-5 text-sm font-bold">الموكل</th>
                  <th className="p-5 text-sm font-bold">التصنيف</th>
                  <th className="p-5 text-sm font-bold">الحالة</th>
                  <th className="p-5 text-sm font-bold">الحالة المالية</th>
                  <th className="p-5 text-sm font-bold text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredDossiers.map(d => {
                  const type = getTypeConfig(d.type_affaire);
                  const status = getStatusConfig(d.statut);
                  return (
                    <tr key={d.id} className="hover:bg-indigo-50/30 transition-colors group">
                      <td className="p-5">
                        <div className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded inline-block">{d.numero_mahakim}</div>
                        <div className="font-bold text-slate-800 text-sm mt-1">{d.titre_affaire}</div>
                      </td>
                      <td className="p-5">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                            <i className="fa-solid fa-user-tag text-slate-300"></i>
                            {d.client_name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono mt-1 mr-6">
                            رقم الموكل: #{d.client_id}
                          </span>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold ${type.bg} ${type.color} border border-current opacity-80`}>
                          <i className={`fa-solid ${type.icon} ml-1`}></i> {type.label}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${status.bg} ${status.color} flex items-center gap-1.5 w-fit border border-current`}>
                            <i className={`fa-solid ${status.icon}`}></i>
                            {status.label}
                          </span>
                          {d.statut !== 'Archivé' && (
                            <button 
                              onClick={() => handleArchive(d.id.toString())}
                              className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                              title="أرشفة الملف"
                            >
                              <i className="fa-solid fa-box-archive text-xs"></i>
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="p-5">
                         <div className="flex flex-col">
                           <span className={`font-mono font-bold text-sm ${d.reste > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                             {Number(d.reste || 0).toLocaleString()} د.م
                           </span>
                           <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">الباقي بذمته</span>
                         </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => onQuickAction?.('hearings-add', d.id)} className="w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm" title="إضافة جلسة"><i className="fa-solid fa-calendar-plus"></i></button>
                          <button onClick={() => onQuickAction?.('fees', d.id)} className="w-8 h-8 flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all shadow-sm" title="الأتعاب"><i className="fa-solid fa-wallet"></i></button>
                          <button onClick={() => onQuickAction?.('dossiers-edit', d.id)} className="w-8 h-8 flex items-center justify-center bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-600 hover:text-white transition-all shadow-sm" title="تعديل"><i className="fa-solid fa-pen-to-square"></i></button>
                          <button onClick={() => handleDelete(d.id.toString())} className="w-8 h-8 flex items-center justify-center bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-all shadow-sm" title="حذف"><i className="fa-solid fa-trash"></i></button>
                          <button onClick={() => handlePrint(d)} className="w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-800 hover:text-white transition-all shadow-sm" title="طباعة البطاقة"><i className="fa-solid fa-print"></i></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredDossiers.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="p-20 text-center">
                      <div className="flex flex-col items-center gap-4 opacity-30">
                        <i className="fa-solid fa-folder-open text-6xl"></i>
                        <p className="font-bold">لم يتم العثور على أي ملفات مطابقة للبحث</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaseList;
