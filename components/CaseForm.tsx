
import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Client } from '../types';

const CaseForm: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    numero_mahakim: '',
    titre_affaire: '',
    type_affaire: 'Civil',
    statut: 'En cours',
    tribunal: '',
    client_id: '',
    juge: '',
    date_ouverture: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    api.getClients().then(setClients).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.client_id) {
      alert('يرجى اختيار الموكل أولاً');
      return;
    }
    setLoading(true);
    try {
      await api.addDossier(formData);
      alert('تم فتح الملف بنجاح وحفظه في النظام');
      setFormData({
        numero_mahakim: '',
        titre_affaire: '',
        type_affaire: 'Civil',
        statut: 'En cours',
        tribunal: '',
        client_id: '',
        juge: '',
        date_ouverture: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      alert('حدث خطأ أثناء حفظ الملف');
    } finally {
      setLoading(false);
    }
  };

  const openInMahakim = () => {
    if (!formData.numero_mahakim) {
      alert('يرجى إدخال رقم الملف أولاً');
      return;
    }
    window.open('https://www.mahakim.ma/Ar/Services/SuiviAffaires_vn/', '_blank');
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="w3-card-4 bg-white">
        <header className="w3-container bg-emerald-50 p-6 border-b flex justify-between items-center">
          <h3 className="font-bold text-emerald-800 flex items-center gap-2 m-0">
            <i className="fa-solid fa-folder-plus"></i>
            فتح ملف قضائي جديد (مرتبط بمحاكم)
          </h3>
          <button 
            type="button"
            onClick={openInMahakim}
            className="text-xs bg-white text-emerald-700 px-4 py-2 rounded-lg border border-emerald-200 font-bold hover:bg-emerald-100 transition shadow-sm"
          >
            <i className="fa-solid fa-magnifying-glass-location ml-2"></i>
            تحقق في بوابة محاكم
          </button>
        </header>

        <form onSubmit={handleSubmit} className="w3-container p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-center gap-4">
              <label className="min-w-[160px] flex items-center gap-2 font-bold text-gray-700">
                <i className="fa-solid fa-hashtag text-emerald-600"></i>
                <span>رقم ملف محاكم</span>
              </label>
              <input 
                type="text" 
                className="flex-1 border-b border-gray-300 focus:border-emerald-500 outline-none py-2 transition-colors font-mono"
                placeholder="2024/1201/XXX"
                value={formData.numero_mahakim}
                onChange={(e) => setFormData({...formData, numero_mahakim: e.target.value})}
                required
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="min-w-[160px] flex items-center gap-2 font-bold text-gray-700">
                <i className="fa-solid fa-gavel text-emerald-600"></i>
                <span>نوع المسطرة</span>
              </label>
              <select 
                className="flex-1 border-b border-gray-300 focus:border-emerald-500 outline-none py-2 bg-transparent transition-colors font-medium"
                value={formData.type_affaire}
                onChange={(e) => setFormData({...formData, type_affaire: e.target.value as any})}
              >
                <option value="Civil">مدني</option>
                <option value="Penal">جنائي</option>
                <option value="Commercial">تجاري</option>
                <option value="Famille">قضاء الأسرة</option>
                <option value="Administratif">إداري</option>
              </select>
            </div>

            <div className="flex items-center gap-4 md:col-span-2">
              <label className="min-w-[160px] flex items-center gap-2 font-bold text-gray-700">
                <i className="fa-solid fa-heading text-emerald-600"></i>
                <span>موضوع الدعوى</span>
              </label>
              <input 
                type="text" 
                className="flex-1 border-b border-gray-300 focus:border-emerald-500 outline-none py-2 transition-colors font-medium"
                placeholder="أدخل عنوان القضية أو موضوعها الرئيسي..."
                value={formData.titre_affaire}
                onChange={(e) => setFormData({...formData, titre_affaire: e.target.value})}
                required
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="min-w-[160px] flex items-center gap-2 font-bold text-gray-700">
                <i className="fa-solid fa-landmark text-emerald-600"></i>
                <span>المحكمة</span>
              </label>
              <input 
                type="text" 
                className="flex-1 border-b border-gray-300 focus:border-emerald-500 outline-none py-2 transition-colors font-medium"
                placeholder="مثال: المحكمة التجارية بالدار البيضاء"
                value={formData.tribunal}
                onChange={(e) => setFormData({...formData, tribunal: e.target.value})}
                required
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="min-w-[160px] flex items-center gap-2 font-bold text-gray-700">
                <i className="fa-solid fa-user-check text-emerald-600"></i>
                <span>الموكل</span>
              </label>
              <select 
                className="flex-1 border-b border-gray-300 focus:border-emerald-500 outline-none py-2 bg-transparent transition-colors font-bold text-indigo-700"
                value={formData.client_id}
                onChange={(e) => setFormData({...formData, client_id: e.target.value})}
                required
              >
                <option value="">بحث عن موكل من القائمة...</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.nom_complet} ({c.cin})</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-4">
              <label className="min-w-[160px] flex items-center gap-2 font-bold text-gray-700">
                <i className="fa-solid fa-user-tie text-emerald-600"></i>
                <span>القاضي المقرر</span>
              </label>
              <input 
                type="text" 
                className="flex-1 border-b border-gray-300 focus:border-emerald-500 outline-none py-2 transition-colors"
                placeholder="اسم القاضي..."
                value={formData.juge}
                onChange={(e) => setFormData({...formData, juge: e.target.value})}
              />
            </div>

             <div className="flex items-center gap-4">
              <label className="min-w-[160px] flex items-center gap-2 font-bold text-gray-700">
                <i className="fa-solid fa-calendar-day text-emerald-600"></i>
                <span>تاريخ الافتتاح</span>
              </label>
              <input 
                type="date" 
                className="flex-1 border-b border-gray-300 focus:border-emerald-500 outline-none py-2"
                value={formData.date_ouverture}
                onChange={(e) => setFormData({...formData, date_ouverture: e.target.value})}
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-8 border-t border-gray-100">
            <button 
              type="reset" 
              onClick={() => setFormData({numero_mahakim: '', titre_affaire: '', type_affaire: 'Civil', statut: 'En cours', tribunal: '', client_id: '', juge: '', date_ouverture: new Date().toISOString().split('T')[0]})}
              className="text-gray-400 hover:text-rose-500 transition font-bold text-sm"
            >
              <i className="fa-solid fa-trash-can ml-1"></i>
              إفراغ الحقول
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="bg-emerald-600 text-white px-10 py-4 rounded-xl shadow-xl shadow-emerald-200 hover:bg-emerald-700 transform hover:-translate-y-1 transition duration-200 flex items-center gap-3 font-bold"
            >
              <i className={`fa-solid ${loading ? 'fa-spinner fa-spin' : 'fa-check'}`}></i>
              {loading ? 'جاري الحفظ...' : 'فتح الملف وحفظ البيانات'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CaseForm;
