
import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Procedure } from '../types';

interface CaseTrackingProps {
  onAddHearing?: (dossierId: string) => void;
  onViewDetails?: (view: any, dossierId: string) => void;
}

const CaseTracking: React.FC<CaseTrackingProps> = ({ onAddHearing }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchNo, setSearchNo] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDossier, setSelectedDossier] = useState<any>(null);
  
  const [relatedData, setRelatedData] = useState({
    hearings: [],
    tasks: [],
    documents: [],
    executions: [],
    procedures: [] as Procedure[]
  });

  useEffect(() => {
    loadBaseData();
  }, []);

  const loadBaseData = async () => {
    try {
      setLoading(true);
      const dossiers = await api.getDossiers();
      setData(dossiers || []);
    } catch (error) {
      console.error('Error loading dossiers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDossier = async (dossier: any) => {
    setSelectedDossier(dossier);
    setLoading(true);
    try {
      const [allHearings, allTasks, allDocs, allExecs] = await Promise.all([
        api.getAudiences(),
        api.getTasks(),
        api.getDocuments(dossier.id.toString()),
        api.getExecutions()
      ]);

      setRelatedData({
        hearings: allHearings.filter((h: any) => h.dossier_id.toString() === dossier.id.toString()),
        tasks: allTasks.filter((t: any) => t.dossier_id?.toString() === dossier.id.toString()),
        documents: allDocs,
        executions: allExecs.filter((e: any) => e.dossier_id.toString() === dossier.id.toString()),
        procedures: dossier.procedures || []
      });

      setTimeout(() => {
        document.getElementById('links-panel')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter(item => {
    const matchesSearch = item.numero_mahakim.toLowerCase().includes(searchNo.toLowerCase()) ||
                         item.titre_affaire.toLowerCase().includes(searchNo.toLowerCase()) ||
                         item.client_name.toLowerCase().includes(searchNo.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || item.statut === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: data.length,
    active: data.filter(d => d.statut === 'En cours').length,
    judged: data.filter(d => d.statut === 'Jugé').length
  };

  return (
    <div className="space-y-8 text-right" dir="rtl">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0"><i className="fa-solid fa-folder-tree"></i></div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">إجمالي الملفات</p>
               <h4 className="text-xl font-black text-slate-800">{stats.total}</h4>
            </div>
         </div>
         <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shrink-0"><i className="fa-solid fa-hourglass-half"></i></div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ملفات جارية</p>
               <h4 className="text-xl font-black text-slate-800">{stats.active}</h4>
            </div>
         </div>
         <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0"><i className="fa-solid fa-circle-check"></i></div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ملفات محكومة</p>
               <h4 className="text-xl font-black text-slate-800">{stats.judged}</h4>
            </div>
         </div>
      </div>

      {/* Search and Filters */}
      <div className="w3-card-4 bg-white p-6 rounded-[2rem] border-r-8 border-indigo-600 shadow-xl overflow-hidden relative border border-slate-100">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 w-full relative">
            <input 
              type="text" 
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-12 py-3 text-sm font-bold focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
              placeholder="ابحث برقم الملف أو اسم الموكل..."
              value={searchNo}
              onChange={(e) => setSearchNo(e.target.value)}
            />
            <i className="fa-solid fa-magnifying-glass absolute right-4 top-1/2 -translate-y-1/2 text-indigo-400"></i>
          </div>
          
          <div className="flex gap-2 p-1 bg-slate-100 rounded-xl shrink-0">
             {[
               { id: 'all', label: 'الكل' },
               { id: 'En cours', label: 'جارية' },
               { id: 'Jugé', label: 'محكومة' }
             ].map(f => (
               <button 
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${statusFilter === f.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
               >
                 {f.label}
               </button>
             ))}
          </div>

          <button onClick={loadBaseData} className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-black transition-all shrink-0">
            <i className="fa-solid fa-rotate"></i>
          </button>
        </div>
      </div>

      {/* Comprehensive Case List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && !data.length ? (
          <div className="col-span-full py-20 text-center animate-pulse text-indigo-500 font-black italic">جاري تحميل القائمة الشاملة للملفات...</div>
        ) : filteredData.map((item) => (
          <div 
            key={item.id} 
            onClick={() => handleSelectDossier(item)}
            className={`cursor-pointer bg-white p-6 rounded-[2rem] border-2 transition-all group ${selectedDossier?.id === item.id ? 'border-indigo-600 shadow-2xl scale-[1.02]' : 'border-slate-100 hover:border-indigo-200 shadow-sm'}`}
          >
            <div className="flex justify-between items-start mb-4">
               <div className="flex flex-col">
                  <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-3 py-1 rounded-lg uppercase font-mono border border-indigo-100 w-fit">{item.numero_mahakim}</span>
                  <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{item.tribunal}</p>
               </div>
               <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shadow-sm ${item.statut === 'Jugé' ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-500'}`}>
                  <i className={`fa-solid ${item.statut === 'Jugé' ? 'fa-check-double' : 'fa-hourglass-start'}`}></i>
               </div>
            </div>
            <h4 className="font-black text-slate-800 text-sm mb-2 group-hover:text-indigo-600 transition-colors h-10 line-clamp-2 leading-relaxed">{item.titre_affaire}</h4>
            
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-6 bg-slate-50 p-2 rounded-xl border border-slate-100">
               <i className="fa-solid fa-user-tag text-[10px] text-indigo-400"></i>
               <span className="truncate">{item.client_name}</span>
            </div>

            <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
               <div className="flex gap-2">
                  <a 
                    href="https://www.mahakim.ma/Ar/Services/SuiviAffaires_vn/" 
                    target="_blank" 
                    rel="noreferrer"
                    onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(item.numero_mahakim); }}
                    className="w-8 h-8 bg-slate-100 hover:bg-emerald-500 hover:text-white text-slate-400 rounded-lg flex items-center justify-center transition-all shadow-sm"
                    title="بحث في محاكم"
                  >
                    <i className="fa-solid fa-magnifying-glass-location text-xs"></i>
                  </a>
                  <button className="w-8 h-8 bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-400 rounded-lg flex items-center justify-center transition-all shadow-sm" title="تفاصيل">
                    <i className="fa-solid fa-eye text-xs"></i>
                  </button>
               </div>
               <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase border ${item.statut === 'Jugé' ? 'bg-emerald-100 text-emerald-600 border-emerald-200' : 'bg-amber-100 text-amber-600 border-amber-200'}`}>
                 {item.statut === 'Jugé' ? 'محكوم' : 'قيد المعالجة'}
               </span>
            </div>
          </div>
        ))}
        {!loading && filteredData.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-300 font-bold italic border-2 border-dashed border-slate-100 rounded-[2rem]">
            لا توجد ملفات تطابق معايير البحث الحالية
          </div>
        )}
      </div>

      {/* DETAILED MONITORING PANEL */}
      {selectedDossier && (
        <div id="links-panel" className="animate-in fade-in slide-in-from-bottom-10 duration-700 mt-12 bg-slate-900 rounded-[3.5rem] p-10 shadow-2xl relative overflow-hidden text-white border border-slate-800">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
          
          <header className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12 relative z-10 border-b border-white/10 pb-8">
             <div>
                <span className="bg-indigo-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] mb-3 inline-block border border-indigo-400">تتبع المسار الإجرائي والمالي</span>
                <h2 className="text-3xl font-black">{selectedDossier.titre_affaire}</h2>
                <div className="flex flex-wrap gap-4 mt-2">
                   <p className="text-slate-400 font-bold flex items-center gap-2">
                      <i className="fa-solid fa-hashtag text-indigo-400"></i>
                      {selectedDossier.numero_mahakim}
                   </p>
                   <p className="text-slate-400 font-bold flex items-center gap-2">
                      <i className="fa-solid fa-landmark text-indigo-400"></i>
                      {selectedDossier.tribunal}
                   </p>
                </div>
             </div>
             <div className="flex gap-3">
                <button onClick={() => onAddHearing?.(selectedDossier.id)} className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl text-xs font-black transition-all border border-white/10 flex items-center gap-2">
                  <i className="fa-solid fa-calendar-plus text-orange-400"></i>
                  جدولة جلسة
                </button>
                <button onClick={() => setSelectedDossier(null)} className="text-slate-500 hover:text-white transition-all"><i className="fa-solid fa-circle-xmark text-2xl"></i></button>
             </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
            {/* PROCEDURES SECTION */}
            <div className="lg:col-span-2 bg-white/5 rounded-3xl p-8 border border-white/5 hover:border-indigo-500/30 transition-all backdrop-blur-sm">
               <h5 className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-8 flex items-center gap-2 border-b border-white/10 pb-4">
                  <i className="fa-solid fa-diagram-nested"></i> المساطر الإجرائية المرتبطة
               </h5>
               <div className="space-y-4 max-h-[350px] overflow-y-auto custom-scrollbar pr-2">
                  {relatedData.procedures.length > 0 ? relatedData.procedures.map((p, idx) => (
                    <div key={p.id} className="bg-black/40 p-5 rounded-2xl border border-white/5 flex justify-between items-center group transition-all hover:bg-black/60">
                       <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shadow-sm border border-white/5 ${p.statut === 'منتهية' ? 'bg-emerald-500/20 text-emerald-500' : p.statut === 'متوقفة' ? 'bg-rose-500/20 text-rose-500' : 'bg-indigo-500/20 text-indigo-400'}`}>
                             {idx + 1}
                          </div>
                          <div>
                             <p className="text-sm font-black">{p.type}</p>
                             <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">تاريخ البدء: {new Date(p.date_debut).toLocaleDateString('ar-MA')}</p>
                          </div>
                       </div>
                       <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase border ${p.statut === 'منتهية' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' : p.statut === 'متوقفة' ? 'bg-rose-500/10 text-rose-500 border-rose-500/30' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'}`}>
                          {p.statut}
                       </span>
                    </div>
                  )) : (
                    <div className="py-20 text-center opacity-20 italic">
                      <i className="fa-solid fa-folder-open text-5xl block mb-4"></i>
                      لا توجد مساطر مسجلة لهذا الملف
                    </div>
                  )}
               </div>
            </div>

            {/* FINANCE SUMMARY */}
            <div className="bg-white/5 rounded-3xl p-8 border border-white/5 hover:border-indigo-500/30 transition-all flex flex-col justify-between">
               <div>
                  <h5 className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-8 flex items-center gap-2 border-b border-white/10 pb-4">
                     <i className="fa-solid fa-wallet"></i> الوضعية المالية للملف
                  </h5>
                  <div className="space-y-6">
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] text-slate-400 font-bold">إجمالي الأتعاب (TTC)</span>
                        <span className="font-black text-xl">{(selectedDossier.montant_total * 1.1 + (selectedDossier.taxes || 0)).toLocaleString()} <span className="text-[8px]">د.م</span></span>
                     </div>
                     <div className="flex justify-between items-center bg-rose-500/10 p-5 rounded-2xl border border-rose-500/20">
                        <span className="text-[10px] text-rose-400 font-black uppercase">الباقي بذمته</span>
                        <span className="font-black text-2xl text-rose-400">{(selectedDossier.reste || 0).toLocaleString()} <span className="text-[10px]">د.م</span></span>
                     </div>
                  </div>
               </div>
               <button className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 py-3 rounded-xl text-[10px] font-black uppercase shadow-lg transition-all">تحديث الأتعاب</button>
            </div>

            {/* QUICK STATS */}
            <div className="grid grid-cols-1 gap-4">
               <div className="bg-white/5 rounded-3xl p-6 border border-white/5 hover:border-amber-500/30 transition-all">
                  <div className="flex justify-between items-center">
                     <h6 className="text-amber-400 text-[9px] font-black uppercase tracking-widest">الجلسات المبرمجة</h6>
                     <span className="bg-amber-500/20 text-amber-500 text-[10px] font-black px-2 py-0.5 rounded-lg">{relatedData.hearings.length}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                     {relatedData.hearings.slice(0, 2).map((h: any, i) => (
                       <span key={i} className="text-[8px] bg-black/20 px-2 py-1 rounded text-slate-400 border border-white/5">{new Date(h.date_audience).toLocaleDateString('ar-MA')}</span>
                     ))}
                  </div>
               </div>
               
               <div className="bg-white/5 rounded-3xl p-6 border border-white/5 hover:border-cyan-500/30 transition-all">
                  <div className="flex justify-between items-center">
                     <h6 className="text-cyan-400 text-[9px] font-black uppercase tracking-widest">المهام (المحررين)</h6>
                     <span className="bg-cyan-500/20 text-cyan-500 text-[10px] font-black px-2 py-0.5 rounded-lg">{relatedData.tasks.length}</span>
                  </div>
               </div>

               <div className="bg-white/10 rounded-3xl p-6 shadow-xl flex flex-col justify-center items-center text-center group cursor-pointer hover:bg-indigo-600 transition-all">
                  <i className="fa-solid fa-file-pdf text-2xl mb-2 group-hover:scale-110 transition-transform"></i>
                  <button className="text-[10px] font-black uppercase tracking-widest">استخراج كشف وضعية</button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseTracking;
