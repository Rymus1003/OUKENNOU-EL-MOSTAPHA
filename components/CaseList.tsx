
import React, { useState, useEffect } from 'react';
import { Dossier } from '../types';
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
      const data = await api.getDossiers();
      setDossiers(data || []);
    } catch (error) {
      console.error('Error loading dossiers:', error);
    } finally {
      setLoading(false);
    }
  };

  // دالة متطورة لجلب أيقونة وتنسيق نوع القضية بناءً على التشريع المغربي
  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'Civil':
        return { label: 'مدني', icon: 'fa-scale-balanced', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' };
      case 'Penal':
        return { label: 'جنائي', icon: 'fa-gavel', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' };
      case 'Commercial':
        return { label: 'تجاري', icon: 'fa-briefcase', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' };
      case 'Famille':
        return { label: 'قضاء الأسرة', icon: 'fa-people-roof', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' };
      case 'Administratif':
        return { label: 'إداري', icon: 'fa-building-columns', color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-100' };
      default:
        return { label: type, icon: 'fa-folder', color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-100' };
    }
  };

  const filteredDossiers = dossiers.filter(d => 
    (d.numero_mahakim && d.numero_mahakim.includes(searchTerm)) || 
    (d.titre_affaire && d.titre_affaire.includes(searchTerm)) ||
    (d.client_name && d.client_name.includes(searchTerm))
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'En cours': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Jugé': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Archivé': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Search Bar */}
      <div className="w3-card-4 bg-white p-6 rounded-xl border-r-4 border-indigo-500 shadow-sm">
        <div className="flex items-center gap-4">
          <label className="min-w-[150px] font-bold flex items-center gap-2 text-slate-700">
            <i className="fa-solid fa-magnifying-glass text-indigo-500"></i>
            <span>بحث في الملفات:</span>
          </label>
          <input 
            type="text" 
            className="flex-1 border-b-2 border-slate-100 focus:border-indigo-500 outline-none py-2 bg-transparent font-medium"
            placeholder="رقم الملف، اسم الموكل، أو موضوع القضية..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="w3-card-4 bg-white rounded-xl overflow-hidden shadow-lg border-t-2 border-indigo-50">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 text-center flex flex-col items-center gap-4">
              <i className="fa-solid fa-circle-notch fa-spin text-4xl text-indigo-500"></i>
              <span className="font-bold text-slate-400">جاري تحميل لائحة القضايا...</span>
            </div>
          ) : (
            <table className="w-full text-right border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="p-5 text-sm font-bold w-48">رقم ملف محاكم</th>
                  <th className="p-5 text-sm font-bold">موضوع القضية</th>
                  <th className="p-5 text-sm font-bold">الموكل</th>
                  <th className="p-5 text-sm font-bold">نوع القضية</th>
                  <th className="p-5 text-sm font-bold">الحالة</th>
                  <th className="p-5 text-sm font-bold text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredDossiers.map(dossier => {
                  const type = getTypeConfig(dossier.type_affaire);
                  return (
                    <tr key={dossier.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="p-5">
                        <div className="font-mono text-sm font-bold text-indigo-700">{dossier.numero_mahakim}</div>
                        <div className="text-[10px] text-slate-400 mt-1 uppercase">{dossier.tribunal}</div>
                      </td>
                      <td className="p-5">
                        <div className="font-bold text-slate-800 line-clamp-1">{dossier.titre_affaire}</div>
                      </td>
                      <td className="p-5">
                        <div className="text-sm font-bold text-slate-700">{dossier.client_name || '---'}</div>
                      </td>
                      <td className="p-5">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold border transition-all ${type.bg} ${type.color} ${type.border}`}>
                          <i className={`fa-solid ${type.icon}`}></i>
                          {type.label}
                        </div>
                      </td>
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(dossier.statut)}`}>
                          {dossier.statut === 'En cours' ? 'قيد المعالجة' : dossier.statut === 'Jugé' ? 'محكوم' : 'مؤرشف'}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => onQuickAction?.('hearings-add', dossier.id)}
                            className="p-2 bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white rounded-lg transition-all"
                            title="إضافة جلسة"
                          >
                            <i className="fa-solid fa-gavel"></i>
                          </button>
                          <button 
                            onClick={() => onQuickAction?.('fees', dossier.id)}
                            className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-lg transition-all"
                            title="الأتعاب"
                          >
                            <i className="fa-solid fa-wallet"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredDossiers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-20 text-center text-slate-400 font-bold italic">
                      لا توجد ملفات قضائية متطابقة مع البحث
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
