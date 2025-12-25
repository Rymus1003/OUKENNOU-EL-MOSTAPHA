
import React, { useState, useEffect } from 'react';
import { api } from '../api';

interface FeesFormProps {
  initialDossierId?: string | null;
}

const FeesForm: React.FC<FeesFormProps> = ({ initialDossierId }) => {
  const [dossiers, setDossiers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    dossier_id: '',
    montant_total: '',
    avance: '',
  });

  useEffect(() => {
    api.getDossiers().then(data => {
      setDossiers(data);
      if (initialDossierId) {
        setFormData(prev => ({ ...prev, dossier_id: initialDossierId }));
        // إذا وجدنا الملف في القائمة، يمكننا محاولة جلب مبالغه الحالية إذا كانت موجودة
        const selected = data.find(d => d.id.toString() === initialDossierId.toString());
        if (selected) {
          setFormData(prev => ({
            ...prev,
            montant_total: selected.montant_total || '',
            avance: selected.avance || ''
          }));
        }
      }
    }).catch(console.error);
  }, [initialDossierId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.dossier_id) return alert('يرجى اختيار ملف');
    setLoading(true);
    try {
      await api.updateFees(formData);
      alert('تم تسجيل الدفعة بنجاح وتحديث البيانات المالية للملف');
      setFormData({ dossier_id: '', montant_total: '', avance: '' });
    } catch (error) {
      alert('حدث خطأ أثناء التحديث المالي');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto" dir="rtl">
      {initialDossierId && (
        <div className="mb-4 bg-rose-50 border border-rose-200 p-3 rounded-lg text-rose-800 text-sm font-bold flex items-center gap-3">
          <i className="fa-solid fa-money-bill-transfer"></i>
          تعديل الوضع المالي للملف المختار من القائمة.
        </div>
      )}
      <div className="w3-card-4 bg-white rounded-xl overflow-hidden shadow-xl border-t-4 border-rose-500">
        <header className="w3-container bg-rose-50 p-6 border-b">
          <h3 className="font-bold text-rose-800 flex items-center gap-2 m-0">
            <i className="fa-solid fa-receipt text-2xl"></i>
            المحاسبة المالية والأتعاب
          </h3>
        </header>

        <form onSubmit={handleSubmit} className="w3-container p-10 space-y-8">
          {/* File Selection */}
          <div className="flex items-center gap-4">
            <label className="min-w-[180px] flex items-center gap-2 font-bold text-slate-700">
              <i className="fa-solid fa-folder-tree text-rose-500"></i>
              <span>الملف القضائي:</span>
            </label>
            <select 
              className="flex-1 border-b-2 border-slate-100 focus:border-rose-500 outline-none py-2 bg-transparent transition-all font-bold text-indigo-800"
              value={formData.dossier_id}
              onChange={(e) => setFormData({...formData, dossier_id: e.target.value})}
              required
            >
              <option value="">-- اختر ملفاً من القائمة --</option>
              {dossiers.map(d => (
                <option key={d.id} value={d.id}>{d.numero_mahakim} - {d.titre_affaire} ({d.client_name})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Total Amount */}
            <div className="flex items-center gap-4">
              <label className="min-w-[180px] flex items-center gap-2 font-bold text-slate-700">
                <i className="fa-solid fa-money-bill-wave text-rose-500"></i>
                <span>إجمالي الأتعاب:</span>
              </label>
              <div className="flex-1 flex items-center border-b-2 border-slate-100 focus-within:border-rose-500 transition-all">
                <input 
                  type="number" 
                  className="w-full outline-none py-2 bg-transparent text-lg font-mono font-bold text-slate-800"
                  placeholder="0.00"
                  value={formData.montant_total}
                  onChange={(e) => setFormData({...formData, montant_total: e.target.value})}
                  required
                />
                <span className="text-xs font-bold text-slate-400 mr-2">د.م</span>
              </div>
            </div>

            {/* Advance Payment */}
            <div className="flex items-center gap-4">
              <label className="min-w-[180px] flex items-center gap-2 font-bold text-slate-700">
                <i className="fa-solid fa-hand-holding-dollar text-rose-500"></i>
                <span>المبلغ المؤدى (تسبيق):</span>
              </label>
              <div className="flex-1 flex items-center border-b-2 border-slate-100 focus-within:border-rose-500 transition-all">
                <input 
                  type="number" 
                  className="w-full outline-none py-2 bg-transparent text-lg font-mono font-bold text-emerald-600"
                  placeholder="0.00"
                  value={formData.avance}
                  onChange={(e) => setFormData({...formData, avance: e.target.value})}
                />
                <span className="text-xs font-bold text-slate-400 mr-2">د.م</span>
              </div>
            </div>
          </div>

          {/* Calculations Summary */}
          {formData.montant_total && (
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex justify-between items-center">
              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">المبلغ الإجمالي</p>
                <p className="text-xl font-black text-slate-800">{parseFloat(formData.montant_total || '0').toLocaleString()} د.م</p>
              </div>
              <div className="text-2xl text-slate-200">
                <i className="fa-solid fa-minus"></i>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">المبلغ المدفوع</p>
                <p className="text-xl font-black text-emerald-600">{parseFloat(formData.avance || '0').toLocaleString()} د.م</p>
              </div>
              <div className="text-2xl text-slate-200">
                <i className="fa-solid fa-equals"></i>
              </div>
              <div className="text-center bg-white px-6 py-2 rounded-xl shadow-sm border border-rose-100">
                <p className="text-[10px] font-bold text-rose-400 uppercase mb-1">الباقي بذمة الموكل</p>
                <p className="text-xl font-black text-rose-600">
                  {(parseFloat(formData.montant_total || '0') - parseFloat(formData.avance || '0')).toLocaleString()} د.م
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-8 border-t border-slate-50">
            <button 
              type="submit"
              disabled={loading}
              className={`bg-rose-600 text-white px-10 py-4 rounded-xl shadow-xl shadow-rose-100 hover:bg-rose-700 transition transform hover:-translate-y-1 flex items-center gap-3 font-bold ${loading ? 'opacity-50' : ''}`}
            >
              <i className={`fa-solid ${loading ? 'fa-circle-notch fa-spin' : 'fa-check-double'}`}></i>
              {loading ? 'جاري المعالجة...' : 'تسجيل وتحديث الحالة المالية'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeesForm;
