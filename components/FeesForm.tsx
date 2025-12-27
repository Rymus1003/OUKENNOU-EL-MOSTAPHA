
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
    taxes: '0', // الرسوم القضائية
  });

  const TVA_RATE = 0.10; // 10%

  useEffect(() => {
    api.getDossiers().then(data => {
      setDossiers(data);
      if (initialDossierId) {
        setFormData(prev => ({ ...prev, dossier_id: initialDossierId }));
        const selected = data.find(d => d.id.toString() === initialDossierId.toString());
        if (selected) {
          setFormData(prev => ({
            ...prev,
            montant_total: selected.montant_total?.toString() || '',
            avance: selected.avance?.toString() || '',
            taxes: selected.taxes?.toString() || '0'
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
      alert('تم تحديث البيانات المالية للملف بنجاح (مع احتساب الضريبة والرسوم)');
      setFormData({ dossier_id: '', montant_total: '', avance: '', taxes: '0' });
    } catch (error) {
      alert('حدث خطأ أثناء التحديث المالي');
    } finally {
      setLoading(false);
    }
  };

  const calculateTVA = () => parseFloat(formData.montant_total || '0') * TVA_RATE;
  const calculateTotalTTC = () => {
    const ht = parseFloat(formData.montant_total || '0');
    const tva = ht * TVA_RATE;
    const taxes = parseFloat(formData.taxes || '0');
    return ht + tva + taxes;
  };

  return (
    <div className="max-w-4xl mx-auto" dir="rtl">
      <div className="w3-card-4 bg-white rounded-3xl overflow-hidden shadow-2xl border-t-8 border-rose-500">
        <header className="bg-rose-50 p-8 border-b flex justify-between items-center">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 bg-rose-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                <i className="fa-solid fa-receipt text-2xl"></i>
             </div>
             <div>
                <h3 className="font-black text-rose-900 m-0 text-xl">المحاسبة المالية والأتعاب</h3>
                <p className="text-[10px] text-rose-400 font-bold uppercase tracking-widest">التوافق الضريبي المغربي (TVA 10%)</p>
             </div>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="p-10 space-y-10">
          <div className="flex items-center gap-4">
            <label className="min-w-[180px] flex items-center gap-2 font-bold text-slate-700">
              <i className="fa-solid fa-folder-tree text-rose-500"></i>
              <span>الملف القضائي:</span>
            </label>
            <select 
              className="flex-1 border-b-2 border-slate-100 focus:border-rose-500 outline-none py-3 bg-transparent transition-all font-bold text-indigo-800 text-lg"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">أتعاب المحامي (HT)</label>
              <div className="flex items-center border-b-2 border-slate-100 focus-within:border-rose-500 transition-all group">
                <i className="fa-solid fa-scale-balanced ml-3 text-slate-300 group-focus-within:text-rose-500"></i>
                <input 
                  type="number" 
                  className="w-full outline-none py-3 bg-transparent text-2xl font-black text-slate-800"
                  placeholder="0.00"
                  value={formData.montant_total}
                  onChange={(e) => setFormData({...formData, montant_total: e.target.value})}
                  required
                />
                <span className="text-xs font-black text-slate-400 mr-2">د.م</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">الرسوم القضائية / المصاريف</label>
              <div className="flex items-center border-b-2 border-slate-100 focus-within:border-rose-500 transition-all group">
                <i className="fa-solid fa-landmark ml-3 text-slate-300 group-focus-within:text-rose-500"></i>
                <input 
                  type="number" 
                  className="w-full outline-none py-3 bg-transparent text-2xl font-black text-slate-800"
                  placeholder="0.00"
                  value={formData.taxes}
                  onChange={(e) => setFormData({...formData, taxes: e.target.value})}
                />
                <span className="text-xs font-black text-slate-400 mr-2">د.م</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">المبلغ المؤدى (تسبيق)</label>
              <div className="flex items-center border-b-2 border-slate-100 focus-within:border-emerald-500 transition-all group">
                <i className="fa-solid fa-hand-holding-dollar ml-3 text-slate-300 group-focus-within:text-emerald-500"></i>
                <input 
                  type="number" 
                  className="w-full outline-none py-3 bg-transparent text-2xl font-black text-emerald-600"
                  placeholder="0.00"
                  value={formData.avance}
                  onChange={(e) => setFormData({...formData, avance: e.target.value})}
                />
                <span className="text-xs font-black text-slate-400 mr-2">د.م</span>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col justify-center">
               <div className="flex justify-between items-center text-xs font-bold text-slate-500 mb-2">
                  <span>الضريبة (TVA 10%):</span>
                  <span className="text-rose-500">+{calculateTVA().toLocaleString()} د.م</span>
               </div>
               <div className="flex justify-between items-center text-lg font-black text-slate-800">
                  <span>المجموع TTC:</span>
                  <span className="text-2xl text-slate-900">{calculateTotalTTC().toLocaleString()} د.م</span>
               </div>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
             <div className="flex justify-between items-center relative z-10">
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-rose-300 uppercase tracking-widest">الباقي بذمة الموكل</p>
                   <p className="text-4xl font-black text-white">{(calculateTotalTTC() - parseFloat(formData.avance || '0')).toLocaleString()} <span className="text-sm">د.م</span></p>
                </div>
                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-black shadow-xl hover:bg-rose-50 transition-all transform active:scale-95 flex items-center gap-3"
                >
                  {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-check-double text-rose-600"></i>}
                  تأكيد التحديث المالي
                </button>
             </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeesForm;
