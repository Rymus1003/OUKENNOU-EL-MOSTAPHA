
import React, { useState, useEffect } from 'react';
import { api } from '../api';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({ name: '', address: '', barreau: '', tva_rate: 10 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getSettings().then(data => { if(data) setSettings(data); });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await api.saveSettings(settings);
    setLoading(false);
    alert('تم حفظ إعدادات المكتب بنجاح');
  };

  return (
    <div className="max-w-4xl mx-auto text-right" dir="rtl">
      <div className="w3-card-4 bg-white rounded-3xl overflow-hidden shadow-xl border-t-4 border-slate-700">
        <header className="bg-slate-50 p-6 border-b">
           <h3 className="font-black text-slate-800 m-0 flex items-center gap-3">
             <i className="fa-solid fa-cabinet-filing text-indigo-600"></i>
             بيانات مكتب المحاماة
           </h3>
        </header>
        <form onSubmit={handleSave} className="p-8 space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-400 uppercase">اسم الأستاذ / المكتب</label>
                <div className="flex items-center gap-3 border-b-2 border-slate-100 focus-within:border-indigo-500 transition-all p-1">
                  <i className="fa-solid fa-user-tie text-slate-300"></i>
                  <input type="text" className="flex-1 outline-none bg-transparent font-bold py-1" value={settings.name} onChange={e => setSettings({...settings, name: e.target.value})} required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-400 uppercase">هيئة المحامين (Barreau)</label>
                <select className="w-full border-b-2 border-slate-100 focus:border-indigo-500 outline-none bg-transparent font-bold py-2" value={settings.barreau} onChange={e => setSettings({...settings, barreau: e.target.value})}>
                  <option value="الدار البيضاء">هيئة الدار البيضاء</option>
                  <option value="الرباط">هيئة الرباط</option>
                  <option value="طنجة">هيئة طنجة</option>
                  <option value="مراكش">هيئة مراكش</option>
                  <option value="أكادير">هيئة أكادير</option>
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="block text-xs font-black text-slate-400 uppercase">العنوان الرسمي للمراسلات</label>
                <div className="flex items-center gap-3 border-b-2 border-slate-100 focus-within:border-indigo-500 transition-all p-1">
                  <i className="fa-solid fa-location-dot text-slate-300"></i>
                  <input type="text" className="flex-1 outline-none bg-transparent font-bold py-1" value={settings.address} onChange={e => setSettings({...settings, address: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-400 uppercase">معدل الضريبة (TVA %)</label>
                <div className="flex items-center gap-3 border-b-2 border-slate-100 focus-within:border-indigo-500 transition-all p-1">
                  <i className="fa-solid fa-percent text-slate-300"></i>
                  <input type="number" className="flex-1 outline-none bg-transparent font-bold py-1" value={settings.tva_rate} onChange={e => setSettings({...settings, tva_rate: parseInt(e.target.value)})} />
                </div>
              </div>
           </div>
           <div className="pt-8 border-t border-slate-50 flex justify-end">
              <button type="submit" disabled={loading} className="bg-slate-800 text-white font-black px-12 py-4 rounded-2xl shadow-xl hover:bg-black transition-all flex items-center gap-3">
                {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-save"></i>}
                حفظ الإعدادات والتغييرات
              </button>
           </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
