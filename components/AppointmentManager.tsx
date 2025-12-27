
import React, { useState, useEffect } from 'react';
import { api } from '../api';

const AppointmentManager: React.FC = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [newApp, setNewApp] = useState({ client_id: '', date: '', type: 'Consultation', note: '' });

  useEffect(() => {
    api.getClients().then(setClients);
    const stored = localStorage.getItem('office_appointments');
    if (stored) setAppointments(JSON.parse(stored));
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApp.client_id || !newApp.date) return;
    const client = clients.find(c => c.id.toString() === newApp.client_id.toString());
    const updated = [...appointments, { ...newApp, id: Date.now(), client_name: client?.nom_complet }];
    setAppointments(updated);
    localStorage.setItem('office_appointments', JSON.stringify(updated));
    setNewApp({ client_id: '', date: '', type: 'Consultation', note: '' });
  };

  const removeApp = (id: number) => {
    const updated = appointments.filter(a => a.id !== id);
    setAppointments(updated);
    localStorage.setItem('office_appointments', JSON.stringify(updated));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-right" dir="rtl">
      <div className="lg:col-span-1">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
          <h3 className="font-black text-slate-800 mb-8 flex items-center gap-3">
            <i className="fa-solid fa-calendar-plus text-indigo-500"></i>
            حجز موعد جديد
          </h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">الموكل</label>
              <select 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-indigo-50 outline-none"
                value={newApp.client_id}
                onChange={e => setNewApp({...newApp, client_id: e.target.value})}
                required
              >
                <option value="">-- اختر الموكل --</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.nom_complet}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">التاريخ والوقت</label>
              <input 
                type="datetime-local" 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-indigo-50 outline-none"
                value={newApp.date}
                onChange={e => setNewApp({...newApp, date: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">نوع الموعد</label>
              <select 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-indigo-50 outline-none"
                value={newApp.type}
                onChange={e => setNewApp({...newApp, type: e.target.value})}
              >
                <option value="Consultation">استشارة أولية</option>
                <option value="Meeting">اجتماع تحضيري</option>
                <option value="Contract">توقيع عقود</option>
                <option value="Update">إخبار بوضعية ملف</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-lg hover:bg-indigo-700 transition-all transform active:scale-95 mt-4">
              تثبيت الموعد
            </button>
          </form>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden min-h-[500px]">
          <header className="p-8 bg-slate-50 border-b flex justify-between items-center">
            <h3 className="font-black text-slate-800 m-0">أجندة مواعيد المكتب</h3>
            <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full uppercase">إجمالي المواعيد: {appointments.length}</span>
          </header>
          
          <div className="divide-y divide-slate-50">
            {appointments.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(app => (
              <div key={app.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-all">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white border border-slate-100 rounded-2xl flex flex-col items-center justify-center text-indigo-600 shadow-sm shrink-0">
                    <span className="text-xl font-black">{new Date(app.date).getDate()}</span>
                    <span className="text-[8px] font-black uppercase">{new Date(app.date).toLocaleDateString('ar-MA', {month: 'short'})}</span>
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 text-lg mb-1">{app.client_name}</h4>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded uppercase">{app.type}</span>
                      <span className="text-[10px] font-bold text-slate-400">
                        <i className="fa-solid fa-clock ml-1"></i>
                        {new Date(app.date).toLocaleTimeString('ar-MA', {hour: '2-digit', minute: '2-digit'})}
                      </span>
                    </div>
                  </div>
                </div>
                <button onClick={() => removeApp(app.id)} className="w-10 h-10 rounded-xl bg-rose-50 text-rose-300 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center">
                  <i className="fa-solid fa-calendar-xmark"></i>
                </button>
              </div>
            ))}
            {appointments.length === 0 && (
              <div className="p-20 text-center text-slate-300 italic flex flex-col items-center gap-4">
                <i className="fa-solid fa-calendar-day text-6xl opacity-20"></i>
                <p className="font-bold">لا توجد مواعيد مكتبية مسجلة</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentManager;
