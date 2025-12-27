
import React, { useState, useEffect } from 'react';
import { api } from '../api';

const ExecutionTracker: React.FC = () => {
  const [executions, setExecutions] = useState<any[]>([]);
  const [dossiers, setDossiers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newExec, setNewExec] = useState({ 
    dossier_id: '', 
    num_execution: '', 
    huissier: '', 
    status: 'In progress', 
    last_action: '', 
    next_action: '' 
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [execs, cases] = await Promise.all([api.getExecutions(), api.getDossiers()]);
    setExecutions(execs);
    setDossiers(cases);
    setLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.addExecution(newExec);
    setNewExec({ dossier_id: '', num_execution: '', huissier: '', status: 'In progress', last_action: '', next_action: '' });
    loadData();
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Completed': return 'bg-emerald-100 text-emerald-600';
      case 'Suspended': return 'bg-rose-100 text-rose-600';
      default: return 'bg-blue-100 text-blue-600';
    }
  };

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2">
              <i className="fa-solid fa-gavel text-emerald-600"></i>
              فتح ملف تنفيذ جديد
            </h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">الملف القضائي</label>
                <select 
                  className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-100 outline-none font-bold"
                  value={newExec.dossier_id}
                  onChange={e => setNewExec({...newExec, dossier_id: e.target.value})}
                  required
                >
                  <option value="">-- اختر ملفاً محكوماً --</option>
                  {dossiers.map(d => <option key={d.id} value={d.id}>{d.numero_mahakim} - {d.titre_affaire}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">رقم ملف التنفيذ</label>
                  <input 
                    type="text" 
                    className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-100 outline-none"
                    placeholder="مثال: 2024/505"
                    value={newExec.num_execution}
                    onChange={e => setNewExec({...newExec, num_execution: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">المفوض القضائي</label>
                  <input 
                    type="text" 
                    className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-100 outline-none"
                    placeholder="الأستاذ..."
                    value={newExec.huissier}
                    onChange={e => setNewExec({...newExec, huissier: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">آخر إجراء تم</label>
                <input 
                  type="text" 
                  className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-100 outline-none"
                  placeholder="مثال: تبليغ الحكم..."
                  value={newExec.last_action}
                  onChange={e => setNewExec({...newExec, last_action: e.target.value})}
                />
              </div>
              <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-emerald-700 transition-all">بدء إجراءات التنفيذ</button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
             <header className="p-6 bg-slate-50 border-b flex justify-between items-center">
                <h3 className="font-black text-slate-800 m-0">سجل ملفات التنفيذ</h3>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase">نشطة حالياً: {executions.length}</span>
             </header>
             <div className="divide-y divide-slate-50">
                {executions.map(exec => {
                  const dossier = dossiers.find(d => d.id.toString() === exec.dossier_id.toString());
                  return (
                    <div key={exec.id} className="p-6 hover:bg-slate-50 transition-colors">
                       <div className="flex justify-between items-start mb-4">
                          <div>
                             <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-tighter mb-1 inline-block">ملف تنفيذ رقم: {exec.num_execution}</span>
                             <h4 className="font-black text-slate-800 text-sm">{dossier?.titre_affaire || 'ملف غير موجود'}</h4>
                             <p className="text-[10px] text-slate-400 font-bold mt-1">المفوض: {exec.huissier}</p>
                          </div>
                          <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase ${getStatusBadge(exec.status)}`}>
                             {exec.status === 'In progress' ? 'في طور التنفيذ' : 'منفذ / مغلق'}
                          </span>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white border border-slate-100 p-3 rounded-xl">
                             <p className="text-[9px] font-black text-slate-400 uppercase mb-1">آخر إجراء</p>
                             <p className="text-xs font-bold text-slate-700">{exec.last_action || '---'}</p>
                          </div>
                          <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl">
                             <p className="text-[9px] font-black text-emerald-400 uppercase mb-1">الإجراء القادم</p>
                             <p className="text-xs font-bold text-emerald-700">{exec.next_action || 'بانتظار التحديث'}</p>
                          </div>
                       </div>
                    </div>
                  );
                })}
                {executions.length === 0 && <div className="p-20 text-center text-slate-300 font-bold italic">لا توجد ملفات تنفيذ مسجلة حالياً</div>}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutionTracker;
