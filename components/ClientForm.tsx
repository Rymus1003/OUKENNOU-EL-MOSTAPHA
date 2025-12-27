
import React, { useState, useEffect } from 'react';
import { api } from '../api';

interface ClientFormProps {
  initialClientId?: string | null;
}

const ClientForm: React.FC<ClientFormProps> = ({ initialClientId }) => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [formData, setFormData] = useState({
    nom_complet: '',
    cin: '',
    telephone: '',
    email: '',
    adresse: ''
  });

  useEffect(() => {
    if (initialClientId) {
      loadClientData(initialClientId);
    }
  }, [initialClientId]);

  const loadClientData = async (id: string) => {
    setFetching(true);
    try {
      const data = await api.getClient(id);
      if (data) {
        setFormData({
          nom_complet: data.nom_complet || '',
          cin: data.cin || '',
          telephone: data.telephone || '',
          email: data.email || '',
          adresse: data.adresse || ''
        });
      }
    } catch (error) {
      console.error('Error fetching client:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (initialClientId) {
        await api.updateClient(initialClientId, formData);
        alert('تم تحديث بيانات الموكل بنجاح');
      } else {
        await api.addClient(formData);
        alert('تم حفظ بيانات الموكل بنجاح في قاعدة البيانات');
        setFormData({ nom_complet: '', cin: '', telephone: '', email: '', adresse: '' });
      }
    } catch (error) {
      alert('حدث خطأ أثناء الاتصال بالسيرفر');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="p-20 text-center flex flex-col items-center gap-4">
        <i className="fa-solid fa-circle-notch fa-spin text-4xl text-indigo-500"></i>
        <span className="font-bold text-slate-400">جاري تحميل بيانات الموكل...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="w3-card-4 bg-white">
        <header className="w3-container bg-indigo-50 p-6 border-b">
          <h3 className="font-bold text-indigo-800 flex items-center gap-2 m-0">
            <i className={`fa-solid ${initialClientId ? 'fa-user-pen' : 'fa-user-plus'}`}></i>
            {initialClientId ? 'تعديل بيانات الموكل' : 'بيانات الهوية للموكل'}
          </h3>
        </header>

        <form onSubmit={handleSubmit} className="w3-container p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4">
              <label className="min-w-[150px] flex items-center gap-2 font-bold text-slate-700">
                <i className="fa-solid fa-signature text-indigo-500"></i>
                <span>الاسم الكامل</span>
              </label>
              <input 
                type="text" 
                className="flex-1 border-b border-gray-300 focus:border-indigo-500 outline-none py-2 transition-colors"
                placeholder="أدخل الاسم الكامل هنا..."
                value={formData.nom_complet}
                onChange={(e) => setFormData({...formData, nom_complet: e.target.value})}
                required
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="min-w-[150px] flex items-center gap-2 font-bold text-slate-700">
                <i className="fa-solid fa-id-card text-indigo-500"></i>
                <span>رقم البطاقة / السجل</span>
              </label>
              <input 
                type="text" 
                className="flex-1 border-b border-gray-300 focus:border-indigo-500 outline-none py-2 transition-colors uppercase font-mono"
                placeholder="مثال: AB123456"
                value={formData.cin}
                onChange={(e) => setFormData({...formData, cin: e.target.value})}
                required
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="min-w-[150px] flex items-center gap-2 font-bold text-slate-700">
                <i className="fa-solid fa-phone text-indigo-500"></i>
                <span>الهاتف</span>
              </label>
              <input 
                type="tel" 
                className="flex-1 border-b border-gray-300 focus:border-indigo-500 outline-none py-2 transition-colors"
                placeholder="06XXXXXXXX"
                value={formData.telephone}
                onChange={(e) => setFormData({...formData, telephone: e.target.value})}
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="min-w-[150px] flex items-center gap-2 font-bold text-slate-700">
                <i className="fa-solid fa-envelope text-indigo-500"></i>
                <span>البريد الإلكتروني</span>
              </label>
              <input 
                type="email" 
                className="flex-1 border-b border-gray-300 focus:border-indigo-500 outline-none py-2 transition-colors"
                placeholder="example@mail.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="flex items-start gap-4">
            <label className="min-w-[150px] flex items-center gap-2 font-bold text-slate-700 pt-2">
              <i className="fa-solid fa-location-dot text-indigo-500"></i>
              <span>العنوان الكامل</span>
            </label>
            <textarea 
              className="flex-1 border border-gray-200 rounded-xl p-4 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none h-32 transition-all resize-none"
              placeholder="أدخل عنوان الموكل الحالي بالتفصيل..."
              value={formData.adresse}
              onChange={(e) => setFormData({...formData, adresse: e.target.value})}
            ></textarea>
          </div>

          <div className="flex justify-end pt-8 border-t border-slate-50">
            <button 
              type="submit"
              disabled={loading}
              className={`bg-indigo-600 text-white px-10 py-4 rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition transform hover:-translate-y-1 flex items-center gap-3 font-bold ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <i className={`fa-solid ${loading ? 'fa-circle-notch fa-spin' : 'fa-floppy-disk'}`}></i>
              {loading ? 'جاري الحفظ...' : (initialClientId ? 'تحديث بيانات الموكل' : 'حفظ الموكل في القاعدة')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientForm;
