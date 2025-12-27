
import React, { useState, useEffect } from 'react';
import { api } from '../api';

const EvidenceVault: React.FC = () => {
  const [dossiers, setDossiers] = useState<any[]>([]);
  const [selectedDossierId, setSelectedDossierId] = useState('');
  const [evidenceList, setEvidenceList] = useState<any[]>([]);
  const [newEvidence, setNewEvidence] = useState({ title: '', type: 'document', description: '' });

  useEffect(() => {
    api.getDossiers().then(setDossiers);
  }, []);

  const loadEvidence = (id: string) => {
    const stored = localStorage.getItem(`evidence_${id}`);
    setEvidenceList(stored ? JSON.parse(stored) : []);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDossierId || !newEvidence.title) return;
    const updated = [...evidenceList, { ...newEvidence, id: Date.now() }];
    setEvidenceList(updated);
    localStorage.setItem(`evidence_${selectedDossierId}`, JSON.stringify(updated));
    setNewEvidence({ title: '', type: 'document', description: '' });
  };

  const removeEvidence = (id: number) => {
    const updated = evidenceList.filter(e => e.id !== id);
    setEvidenceList(updated);
    localStorage.setItem(`evidence_${selectedDossierId}`, JSON.stringify(updated));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 text-right" dir="rtl">
      <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100">
        <header className="flex items-center gap-5 mb-10">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-3">
            <i className="fa-solid fa-vault text-2xl text-amber-400"></i>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-800">خزنة الأدلة ووسائل الإثبات</h3>
            <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest mt-1">إدارة الحجج والمستندات والشهود لكل ملف</p>
          </div>
        </header>

        <div className="mb-10 bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100">
          <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 pr-2">اختر الملف القضائي للبدء</label>
          <select 
            className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 text-lg font-bold focus:ring-4 focus:ring-amber-50 outline-none transition-all text-indigo-700"
            value={selectedDossierId}
            onChange={(e) => { setSelectedDossierId(e.target.value); loadEvidence(e.target.value); }}
          >
            <option value="">-- اختر ملفاً من الأرشيف --</option>
            {dossiers.map(d => <option key={d.id} value={d.id}>{d.numero_mahakim} - {d.titre_affaire}</option>)}
          </select>
        </div>

        {selectedDossierId ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <form onSubmit={handleAdd} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                <h4 className="font-black text-slate-800 text-sm mb-4">إضافة حجة/دليل جديد</h4>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 mb-1">وصف الدليل (مثال: شهادة ملكية)</label>
                  <input 
                    type="text" 
                    className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-amber-100 outline-none"
                    value={newEvidence.title}
                    onChange={e => setNewEvidence({...newEvidence, title: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 mb-1">نوع الدليل</label>
                  <select 
                    className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-amber-100 outline-none"
                    value={newEvidence.type}
                    onChange={e => setNewEvidence({...newEvidence, type: e.target.value})}
                  >
                    <option value="document">وثيقة رسمية</option>
                    <option value="witness">شاهد / إفادة</option>
                    <option value="digital">دليل رقمي (صورة/فيديو)</option>
                    <option value="physical">حجة مادية</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 mb-1">ملاحظات حول أهمية الدليل</label>
                  <textarea 
                    className="w-full border border-slate-200 rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-amber-100 outline-none h-24 resize-none"
                    value={newEvidence.description}
                    onChange={e => setNewEvidence({...newEvidence, description: e.target.value})}
                  ></textarea>
                </div>
                <button type="submit" className="w-full bg-slate-900 text-white font-black py-3 rounded-xl shadow-lg hover:bg-black transition-all flex items-center justify-center gap-2">
                  <i className="fa-solid fa-plus-circle text-amber-500"></i>
                  إيداع في الخزنة
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-4">
              {evidenceList.length === 0 ? (
                <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[2.5rem] opacity-30 flex flex-col items-center gap-4">
                  <i className="fa-solid fa-box-open text-6xl text-slate-300"></i>
                  <p className="font-bold">خزنة الأدلة فارغة لهذا الملف</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {evidenceList.map(item => (
                    <div key={item.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-start justify-between group">
                      <div className="flex gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm ${item.type === 'witness' ? 'bg-purple-500' : item.type === 'document' ? 'bg-blue-500' : 'bg-emerald-500'}`}>
                          <i className={`fa-solid ${item.type === 'witness' ? 'fa-user-tie' : item.type === 'document' ? 'fa-file-signature' : 'fa-camera'}`}></i>
                        </div>
                        <div>
                          <h5 className="font-black text-slate-800 text-sm">{item.title}</h5>
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{item.type}</span>
                          <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                      <button onClick={() => removeEvidence(item.id)} className="text-slate-300 hover:text-rose-500 transition-colors p-2">
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="py-20 text-center text-slate-400 font-bold opacity-50 flex flex-col items-center gap-4">
             <i className="fa-solid fa-shield-halved text-6xl"></i>
             <p>يرجى اختيار ملف قضائي لإدارة وسائل الإثبات الخاصة به</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EvidenceVault;
