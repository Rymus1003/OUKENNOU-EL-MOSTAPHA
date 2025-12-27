
import React, { useState, useEffect } from 'react';
import { api } from '../api';

const GlobalCommandCenter: React.FC<{ isOpen: boolean, onClose: () => void, onNavigate: (view: any, id?: string) => void }> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    searchAll();
  }, [query]);

  const searchAll = async () => {
    const [clients, dossiers] = await Promise.all([api.getClients(), api.getDossiers()]);
    const q = query.toLowerCase();
    
    const clientMatches = clients.filter((c: any) => c.nom_complet.toLowerCase().includes(q) || c.cin.toLowerCase().includes(q))
                                 .map((c: any) => ({ type: 'client', id: c.id, label: c.nom_complet, sub: `بطاقة وطنية: ${c.cin}`, icon: 'fa-user' }));
    
    const caseMatches = dossiers.filter((d: any) => d.numero_mahakim.toLowerCase().includes(q) || d.titre_affaire.toLowerCase().includes(q))
                                .map((d: any) => ({ type: 'dossier', id: d.id, label: d.numero_mahakim, sub: d.titre_affaire, icon: 'fa-folder-open' }));

    setResults([...clientMatches, ...caseMatches].slice(0, 8));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-4 p-6 border-b border-slate-100">
          <i className="fa-solid fa-magnifying-glass text-indigo-500 text-xl"></i>
          <input 
            autoFocus
            type="text" 
            className="flex-1 bg-transparent border-none outline-none text-xl font-black text-slate-800 placeholder:text-slate-300"
            placeholder="ابحث عن موكل، ملف، أو إجراء سري..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="text-[10px] font-black text-slate-300 bg-slate-100 px-2 py-1 rounded-lg uppercase">ESC للغلق</span>
        </div>

        <div className="max-h-[400px] overflow-y-auto p-4 custom-scrollbar">
          {results.length > 0 ? (
            <div className="space-y-2">
              {results.map((res, i) => (
                <button 
                  key={i}
                  onClick={() => {
                    onNavigate(res.type === 'client' ? 'clients-edit' : 'dossier-details', res.id.toString());
                    onClose();
                  }}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-indigo-50 transition-all text-right group"
                >
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <i className={`fa-solid ${res.icon} text-lg`}></i>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-black text-slate-800 truncate">{res.label}</p>
                    <p className="text-[10px] text-slate-400 font-bold truncate">{res.sub}</p>
                  </div>
                  <i className="fa-solid fa-chevron-left text-slate-200 group-hover:translate-x-[-5px] transition-transform"></i>
                </button>
              ))}
            </div>
          ) : query.length > 1 ? (
            <div className="p-12 text-center text-slate-400 italic">لا توجد نتائج مطابقة لبحثك...</div>
          ) : (
            <div className="p-8 space-y-4">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">اقتراحات سريعة:</p>
               <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => { onNavigate('clients-add'); onClose(); }} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl text-xs font-black text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                    <i className="fa-solid fa-user-plus"></i> إضافة موكل جديد
                  </button>
                  <button onClick={() => { onNavigate('dossiers-add'); onClose(); }} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl text-xs font-black text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all">
                    <i className="fa-solid fa-folder-plus"></i> فتح ملف قضائي
                  </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalCommandCenter;
