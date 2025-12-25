
import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Dossier } from '../types';

interface HearingFormProps {
  initialDossierId?: string | null;
}

const HearingForm: React.FC<HearingFormProps> = ({ initialDossierId }) => {
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [loading, setLoading] = useState(false);
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
      {initialDossierId && (
        <div className="mb-4 bg-orange-50 border border-orange-200 p-3 rounded-lg text-orange-800 text-sm font-bold flex items-center gap-3">
          <i className="fa-solid fa-link"></i>
          سيتم ربط الجلسة مباشرة بالملف المختار من القائمة.
        </div>
      )}
      <div className="w3-card-4 bg-white">
        <header className="w3-container bg-orange-50 p-6 border-b">
          <h3 className="font-bold text-orange-800 flex items-center gap-2">
            <i className="fa-solid fa-gavel"></i>
            جدولة جلسة جديدة
          </h3>
        </header>

        <form onSubmit={handleSubmit} className="w3-container p-8 space-y-6">
          <div className="flex items-center gap-4">
            <label className="min-w-[180px] flex items-center gap-2 font-medium text-gray-700">
              <i className="fa-solid fa-folder-open text-orange-500"></i>
              <span>رقم الملف</span>
            </label>
            <select 
              className="flex-1 border-b border-gray-300 focus:border-orange-500 outline-none py-2 bg-transparent font-bold text-indigo-700"
              value={formData.dossier_id}
              onChange={(e) => setFormData({...formData, dossier_id: e.target.value})}
              required
            >
              <option value="">اختر الملف القضائي...</option>
              {dossiers.map(d => (
                <option key={d.id} value={d.id}>{d.numero_mahakim} - {d.titre_affaire}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4">
            <label className="min-w-[180px] flex items-center gap-2 font-medium text-gray-700">
              <i className="fa-solid fa-calendar-days text-orange-500"></i>
              <span>تاريخ ووقت الجلسة</span>
            </label>
            <input 
              type="datetime-local" 
              className="flex-1 border-b border-gray-300 focus:border-orange-500 outline-none py-2"
              value={formData.date_audience}
              onChange={(e) => setFormData({...formData, date_audience: e.target.value})}
              required
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="min-w-[180px] flex items-center gap-2 font-medium text-gray-700">
              <i className="fa-solid fa-door-open text-orange-500"></i>
              <span>رقم القاعة</span>
            </label>
            <input 
              type="text" 
              className="flex-1 border-b border-gray-300 focus:border-orange-500 outline-none py-2"
              placeholder="مثال: القاعة 7، الدور الثاني"
              value={formData.salle}
              onChange={(e) => setFormData({...formData, salle: e.target.value})}
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="min-w-[180px] flex items-center gap-2 font-medium text-gray-700">
              <i className="fa-solid fa-user-tie text-orange-500"></i>
              <span>اسم القاضي</span>
            </label>
            <input 
              type="text" 
              className="flex-1 border-b border-gray-300 focus:border-orange-500 outline-none py-2"
              placeholder="أدخل اسم القاضي المقرر..."
              value={formData.juge_audience}
              onChange={(e) => setFormData({...formData, juge_audience: e.target.value})}
            />
          </div>

          <div className="flex items-start gap-4">
            <label className="min-w-[180px] flex items-center gap-2 font-medium text-gray-700 pt-2">
              <i className="fa-solid fa-note-sticky text-orange-500"></i>
              <span>ملاحظات إضافية</span>
            </label>
            <textarea 
              className="flex-1 border border-gray-200 rounded-lg p-3 h-24 focus:ring-2 focus:ring-orange-100 outline-none"
              placeholder="اكتب ملاحظات الجلسة أو الإجراءات المطلوبة..."
              value={formData.notes_audience}
              onChange={(e) => setFormData({...formData, notes_audience: e.target.value})}
            ></textarea>
          </div>

          <div className="flex justify-end pt-6">
            <button 
              type="submit"
              disabled={loading}
              className="bg-orange-600 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-orange-700 transition flex items-center gap-2 font-bold"
            >
              <i className={`fa-solid ${loading ? 'fa-spinner fa-spin' : 'fa-calendar-check'}`}></i>
              {loading ? 'جاري الحفظ...' : 'تأكيد الجدولة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HearingForm;
