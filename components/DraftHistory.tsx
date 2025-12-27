
import React, { useState, useEffect } from 'react';
import { api } from '../api';

const DraftHistory: React.FC = () => {
  const [drafts, setDrafts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDrafts();
  }, []);

  const loadDrafts = async () => {
    setLoading(true);
    const data = await api.getDrafts();
    setDrafts(data);
    setLoading(false);
  };

  const deleteDraft = async (id: number) => {
    if (confirm('هل تريد حذف هذه المسودة من الأرشيف؟')) {
      await api.deleteDraft(id);
      loadDrafts();
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'Cassation': return 'fa-building-columns text-indigo-500';
      case 'Consultation': return 'fa-comments-legal text-purple-500';
      case 'Rebuttal': return 'fa-shield-halved text-rose-500';
      default: return 'fa-file-lines text-slate-400';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 text-right" dir="rtl">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-2">
              <i className="fa-solid fa-clock-rotate-left text-2xl text-indigo-400"></i>
            </div>
            <div>
              <h3 className="text-3xl font-black text-slate-800">أرشيف المسودات الذكية</h3>
              <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest mt-1">تتبع وحفظ جميع المذكرات الموّلدة بالذكاء الاصطناعي</p>
            </div>
          </div>
          <button onClick={loadDrafts} className="w-12 h-12 rounded-xl bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all flex items-center justify-center">
            <i className={`fa-solid fa-rotate ${loading ? 'fa-spin' : ''}`}></i>
          </button>
        </header>

        {loading ? (
          <div className="p-32 text-center animate-pulse text-slate-300 font-black">جاري تحميل الأرشيف القانوني...</div>
        ) : drafts.length === 0 ? (
          <div className="py-32 text-center opacity-30 flex flex-col items-center gap-6">
             <i className="fa-solid fa-ghost text-8xl text-slate-200"></i>
             <p className="font-black text-xl text-slate-400">لا توجد مسودات محفوظة في السجل حالياً</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {drafts.map(draft => (
               <div key={draft.id} className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 hover:border-indigo-300 transition-all group relative flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                           <i className={`fa-solid ${getIcon(draft.type)}`}></i>
                        </div>
                        <div>
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">{draft.type}</span>
                           <span className="text-[9px] font-bold text-slate-300">{new Date(draft.id).toLocaleDateString('ar-MA')}</span>
                        </div>
                     </div>
                     <button onClick={() => deleteDraft(draft.id)} className="text-slate-300 hover:text-rose-500 transition-colors"><i className="fa-solid fa-trash-can"></i></button>
                  </div>
                  
                  <h4 className="font-black text-slate-800 text-sm mb-4 line-clamp-1">{draft.title}</h4>
                  
                  <div className="flex-1 line-clamp-5 text-xs text-slate-500 leading-[2] font-medium mb-8 opacity-70 italic">
                     {draft.content}
                  </div>

                  <div className="flex gap-3">
                     <button 
                        onClick={() => {navigator.clipboard.writeText(draft.content); alert('تم النسخ');}}
                        className="flex-1 bg-white px-4 py-3 rounded-2xl text-[10px] font-black shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 border border-slate-100"
                     >
                        <i className="fa-solid fa-copy text-indigo-400"></i> نسخ النص
                     </button>
                     <button className="w-12 h-12 bg-white rounded-2xl text-slate-400 hover:text-indigo-600 shadow-sm border border-slate-100 transition-all flex items-center justify-center">
                        <i className="fa-solid fa-eye"></i>
                     </button>
                  </div>
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DraftHistory;
