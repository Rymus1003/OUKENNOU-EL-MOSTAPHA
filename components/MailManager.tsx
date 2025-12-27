
import React, { useState, useEffect } from 'react';
import { api } from '../api';

const MailManager: React.FC = () => {
  const [mails, setMails] = useState<any[]>([]);
  const [dossiers, setDossiers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMail, setNewMail] = useState({ 
    type: 'incoming', 
    subject: '', 
    sender: '', 
    recipient: '', 
    dossier_id: '',
    status: 'pending'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [mailsData, dossiersData] = await Promise.all([api.getMails(), api.getDossiers()]);
    setMails(mailsData || []);
    setDossiers(dossiersData || []);
    setLoading(false);
  };

  const handleAddMail = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.addMail({ ...newMail, date: new Date().toISOString() });
    setNewMail({ type: 'incoming', subject: '', sender: '', recipient: '', dossier_id: '', status: 'pending' });
    await loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه المراسلة؟')) {
      await api.deleteMail(id);
      await loadData();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-right" dir="rtl">
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2">
            <i className="fa-solid fa-paper-plane text-indigo-500"></i>
            تسجيل مراسلة جديدة
          </h3>
          <form onSubmit={handleAddMail} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">نوع المراسلة</label>
              <div className="flex gap-2 p-1 bg-slate-50 rounded-xl">
                 <button 
                  type="button"
                  onClick={() => setNewMail({...newMail, type: 'incoming'})}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${newMail.type === 'incoming' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                 >وارد (Arrivée)</button>
                 <button 
                  type="button"
                  onClick={() => setNewMail({...newMail, type: 'outgoing'})}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${newMail.type === 'outgoing' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                 >صادر (Départ)</button>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">الموضوع</label>
              <input 
                type="text" 
                className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
                placeholder="مثال: إشعار بحكم، طلب استدعاء..."
                value={newMail.subject}
                onChange={e => setNewMail({...newMail, subject: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">{newMail.type === 'incoming' ? 'المرسل' : 'المرسل إليه'}</label>
              <input 
                type="text" 
                className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
                placeholder="اسم الجهة أو الشخص..."
                value={newMail.type === 'incoming' ? newMail.sender : newMail.recipient}
                onChange={e => setNewMail({...newMail, [newMail.type === 'incoming' ? 'sender' : 'recipient']: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">ربط بملف قضائي</label>
              <select 
                className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-100 outline-none font-bold text-indigo-700"
                value={newMail.dossier_id}
                onChange={e => setNewMail({...newMail, dossier_id: e.target.value})}
              >
                <option value="">-- مراسلة عامة --</option>
                {dossiers.map(d => <option key={d.id} value={d.id}>{d.numero_mahakim} - {d.titre_affaire}</option>)}
              </select>
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-indigo-700 transition-all mt-4">حفظ في سجل البريد</button>
          </form>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <header className="p-6 bg-slate-50 border-b flex justify-between items-center">
            <h3 className="font-black text-slate-800 m-0 flex items-center gap-2">
              <i className="fa-solid fa-envelopes-bulk text-slate-400"></i>
              سجل المراسلات الإلكتروني
            </h3>
          </header>
          
          <div className="overflow-x-auto">
            {loading ? <div className="p-10 text-center animate-pulse">جاري التحميل...</div> : (
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="p-4 border-b">التاريخ</th>
                    <th className="p-4 border-b">النوع</th>
                    <th className="p-4 border-b">الموضوع</th>
                    <th className="p-4 border-b">الجهة</th>
                    <th className="p-4 border-b text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {mails.map(mail => (
                    <tr key={mail.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 text-xs font-bold text-slate-500">{new Date(mail.date).toLocaleDateString('ar-MA')}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase ${mail.type === 'incoming' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                          {mail.type === 'incoming' ? 'وارد' : 'صادر'}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-slate-800 text-sm">
                        {mail.subject}
                        {mail.dossier_id && (
                          <div className="text-[9px] text-indigo-400 mt-1">ملف: {dossiers.find(d => d.id.toString() === mail.dossier_id.toString())?.numero_mahakim}</div>
                        )}
                      </td>
                      <td className="p-4 text-xs text-slate-600 font-medium">{mail.type === 'incoming' ? mail.sender : mail.recipient}</td>
                      <td className="p-4 text-center">
                        <button onClick={() => handleDelete(mail.id)} className="text-rose-300 hover:text-rose-600 transition-colors"><i className="fa-solid fa-trash-can"></i></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {mails.length === 0 && !loading && <div className="p-20 text-center text-slate-300 font-bold italic">لا توجد مراسلات مسجلة</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MailManager;
