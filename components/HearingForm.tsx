
import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Dossier } from '../types';

interface HearingFormProps {
  initialDossierId?: string | null;
}

const HearingForm: React.FC<HearingFormProps> = ({ initialDossierId }) => {
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    dossier_id: '',
    date_audience: '',
    salle: '',
    juge_audience: '',
    decision_intermediaire: '',
    notes_audience: ''
  });

  useEffect(() => {
    api.getDossiers().then(data => {
      setDossiers(data);
      if (initialDossierId) {
        setFormData(prev => ({ ...prev, dossier_id: initialDossierId }));
      }
    }).catch(console.error);
  }, [initialDossierId]);

  const selectedDossier = dossiers.find(d => d.id.toString() === formData.dossier_id);

  const handleCopyNumber = () => {
    if (selectedDossier) {
      navigator.clipboard.writeText(selectedDossier.numero_mahakim).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.dossier_id) return alert('يجب اختيار ملف أولاً');
    setLoading(true);
    try {
      await api.addAudience(formData);
      alert('تمت جدولة الجلسة بنجاح');
      setFormData({
        dossier_id: '',
        date_audience: '',
        salle: '',
        juge_audience: '',
        decision_intermediaire: '',
        notes_audience: ''
      });
    } catch (error) {
      alert('حدث خطأ أثناء الجدولة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {formData.dossier_id && (
        <div className="mb-6 bg-slate-900 text-white p-6 rounded-[2rem] flex flex-col md:flex-row justify-between items-center gap-4 shadow-2xl animate-in slide-in-from-top-4 duration-300 border border-slate-800">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-xl shadow-lg border border-indigo-400">
                <i className="fa-solid fa-hashtag"></i>
             </div>
             <div>
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">رقم الملف للبحث (Copie automatique)</p>
                <h4 className="text-xl font-black font-mono">{selectedDossier?.numero_mahakim}</h4>
             </div>
          </div>
          <div className="flex items-center gap-3">
             {copied && <span className="text-[10px] font-black text-emerald-400 animate-pulse bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">جاهز للصق!</span>}
             <a 
                href="https://www.mahakim.ma/Ar/Services/SuiviAffaires_vn/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleCopyNumber}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-xl text-xs font-black shadow-xl transition-all transform active:scale-95 flex items-center gap-2 border border-emerald-400"
              >
                <i className="fa-solid fa-magnifying-glass-location"></i>
                فتح تتبع الملف في محاكم
              </a>
          </div>
        </div>
      )}
      
      <div className="w3-card-4 bg-white rounded-[2.5rem] overflow-hidden shadow-xl border-t-8 border-orange-500 border border-slate-100">
        <header className="bg-orange-50 p-8 border-b border-orange-100">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                <i className="fa-solid fa-calendar-plus text-2xl"></i>
             </div>
             <div>
                <h3 className="font-black text-orange-900 m-0 text-xl">جدولة جلسة جديدة</h3>
                <p className="text-[10px] text-orange-400 font-bold uppercase tracking-widest">تحديث المسطرة القضائية لملفات المكتب</p>
             </div>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <label className="min-w-[150px] flex items-center gap-2 font-bold text-slate-700">
              <i className="fa-solid fa-folder-tree text-orange-500"></i>
              <span>الملف القضائي:</span>
            </label>
            <select 
              className="flex-1 border-b-2 border-slate-100 focus:border-orange-500 outline-none py-3 bg-transparent transition-all font-bold text-indigo-800 text-lg"
              value={formData.dossier_id}
              onChange={(e) => setFormData({...formData, dossier_id: e.target.value})}
              required
            >
              <option value="">-- اختر الملف من الأرشيف --</option>
              {dossiers.map(d => (
                <option key={d.id} value={d.id}>{d.numero_mahakim} - {d.titre_affaire}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">تاريخ ووقت الجلسة</label>
              <div className="flex items-center border-b-2 border-slate-100 focus-within:border-orange-500 transition-all p-1">
                <i className="fa-solid fa-clock text-slate-300 ml-3"></i>
                <input 
                  type="datetime-local" 
                  className="w-full outline-none bg-transparent font-bold text-slate-800"
                  value={formData.date_audience}
                  onChange={(e) => setFormData({...formData, date_audience: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">رقم القاعة</label>
              <div className="flex items-center border-b-2 border-slate-100 focus-within:border-orange-500 transition-all p-1">
                <i className="fa-solid fa-door-open text-slate-300 ml-3"></i>
                <input 
                  type="text" 
                  className="w-full outline-none bg-transparent font-bold text-slate-800"
                  placeholder="مثال: القاعة رقم 5"
                  value={formData.salle}
                  onChange={(e) => setFormData({...formData, salle: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">القاضي المقرر</label>
              <div className="flex items-center border-b-2 border-slate-100 focus-within:border-orange-500 transition-all p-1">
                <i className="fa-solid fa-user-tie text-slate-300 ml-3"></i>
                <input 
                  type="text" 
                  className="w-full outline-none bg-transparent font-bold text-slate-800"
                  placeholder="اسم القاضي أو الهيئة..."
                  value={formData.juge_audience}
                  onChange={(e) => setFormData({...formData, juge_audience: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">الإجراء المطلوب</label>
              <div className="flex items-center border-b-2 border-slate-100 focus-within:border-orange-500 transition-all p-1">
                <i className="fa-solid fa-note-sticky text-slate-300 ml-3"></i>
                <input 
                  type="text" 
                  className="w-full outline-none bg-transparent font-bold text-slate-800"
                  placeholder="مثال: جواب، تعقيب، خبرة..."
                  value={formData.notes_audience}
                  onChange={(e) => setFormData({...formData, notes_audience: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-8 border-t border-slate-50">
            <button 
              type="submit"
              disabled={loading}
              className="bg-slate-900 text-white px-12 py-4 rounded-2xl font-black shadow-xl hover:bg-black transition-all transform active:scale-95 flex items-center gap-3"
            >
              {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-calendar-check text-orange-400"></i>}
              {loading ? 'جاري التسجيل...' : 'تثبيت موعد الجلسة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HearingForm;
