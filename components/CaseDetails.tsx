
import React, { useState, useEffect } from 'react';
import { api } from '../api';

interface CaseDetailsProps {
  dossierId: string;
  onBack: () => void;
}

const CaseDetails: React.FC<CaseDetailsProps> = ({ dossierId, onBack }) => {
  const [dossier, setDossier] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [dossierId]);

  const loadData = async () => {
    setLoading(true);
    const data = await api.getDossier(dossierId);
    setDossier(data);
    setLoading(false);
  };

  if (loading) return <div className="p-20 text-center animate-pulse">جاري تحميل بيانات الملف...</div>;
  if (!dossier) return <div className="p-20 text-center text-rose-500 font-bold">الملف غير موجود!</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-right" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors">
          <i className="fa-solid fa-arrow-right"></i>
          العودة لقائمة الملفات
        </button>
        <h2 className="text-2xl font-black text-slate-800">تفاصيل الملف: {dossier.numero_mahakim}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h4 className="font-black text-slate-800 mb-6 flex items-center gap-2 border-b pb-4">
              <i className="fa-solid fa-info-circle text-indigo-500"></i>
              معلومات الموكل والقضية
            </h4>
            <div className="space-y-4">
              <p className="text-sm font-bold text-slate-600">الموكل: <span className="text-indigo-600">{dossier.client_name}</span></p>
              <p className="text-sm font-bold text-slate-600">الخصم: <span className="text-rose-500">{dossier.partie_adverse}</span></p>
              <p className="text-sm font-bold text-slate-600">المحكمة: <span className="text-slate-800">{dossier.tribunal}</span></p>
            </div>
          </div>

          <div className="bg-indigo-900 p-6 rounded-3xl shadow-xl text-white">
            <h4 className="font-black mb-4 flex items-center gap-2">
              <i className="fa-solid fa-wallet"></i>
              الوضعية المالية
            </h4>
            <p className="text-2xl font-black">{dossier.reste} <span className="text-sm">د.م متبقية</span></p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 min-h-[500px]">
            <h3 className="font-black text-slate-800 mb-8 flex items-center gap-3 border-b pb-4">
              <i className="fa-solid fa-diagram-nested text-emerald-500"></i>
              المساطر الإجرائية المرتبطة (Procedures)
            </h3>
            
            <div className="space-y-4">
              {dossier.procedures && dossier.procedures.length > 0 ? dossier.procedures.map((proc: any) => (
                <div key={proc.id} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex justify-between items-center hover:border-emerald-200 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm border border-slate-100">
                       <i className="fa-solid fa-folder-tree"></i>
                    </div>
                    <div>
                      <h5 className="font-black text-slate-800 text-sm">{proc.type}</h5>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">تاريخ البدء: {new Date(proc.date_debut).toLocaleDateString('ar-MA')}</p>
                    </div>
                  </div>
                  <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-3 py-1 rounded-full uppercase border border-emerald-200">
                    {proc.statut}
                  </span>
                </div>
              )) : (
                <div className="py-20 text-center text-slate-300 italic">لا توجد مساطر مسجلة حالياً</div>
              )}
              
              <button className="w-full mt-4 py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:border-indigo-300 hover:text-indigo-500 transition-all flex items-center justify-center gap-2">
                <i className="fa-solid fa-plus-circle"></i>
                إضافة مساطر جديدة للملف
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseDetails;
