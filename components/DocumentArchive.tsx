
import React, { useState, useEffect } from 'react';
import { api } from '../api';

interface DocumentArchiveProps {
  initialDossierId?: string | null;
}

const DocumentArchive: React.FC<DocumentArchiveProps> = ({ initialDossierId }) => {
  const [dossiers, setDossiers] = useState<any[]>([]);
  const [selectedDossierId, setSelectedDossierId] = useState(initialDossierId || '');
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocType, setNewDocType] = useState('Official');

  useEffect(() => {
    api.getDossiers().then(setDossiers);
    if (selectedDossierId) {
      loadDocs(selectedDossierId);
    }
  }, [selectedDossierId]);

  const loadDocs = async (id: string) => {
    setLoading(true);
    const docs = await api.getDocuments(id);
    setDocuments(docs);
    setLoading(false);
  };

  const handleAddDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDossierId || !newDocName) return;
    await api.addDocument({
      dossier_id: selectedDossierId,
      name: newDocName,
      type: newDocType,
      date: new Date().toISOString()
    });
    setNewDocName('');
    loadDocs(selectedDossierId);
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المستند من الأرشيف؟')) {
      await api.deleteDocument(id);
      loadDocs(selectedDossierId);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-right" dir="rtl">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <i className="fa-solid fa-box-archive text-2xl"></i>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800">الأرشيف الرقمي للمستندات</h3>
            <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest">إدارة النسخ الإلكترونية للملفات</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end border-b border-slate-50 pb-8 mb-8">
          <div className="md:col-span-2">
            <label className="block text-xs font-black text-slate-400 mb-2 uppercase">الملف القضائي</label>
            <select 
              className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-bold text-indigo-700"
              value={selectedDossierId}
              onChange={(e) => setSelectedDossierId(e.target.value)}
            >
              <option value="">-- اختر ملفاً لعرض أرشيفه --</option>
              {dossiers.map(d => <option key={d.id} value={d.id}>{d.numero_mahakim} - {d.titre_affaire}</option>)}
            </select>
          </div>
          <div className="md:col-span-2 flex justify-end">
            <div className="text-xs text-slate-400 font-bold bg-slate-50 px-4 py-2 rounded-xl">
               عدد الوثائق المؤرشفة: <span className="text-indigo-600">{documents.length}</span>
            </div>
          </div>
        </div>

        {selectedDossierId ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
               <form onSubmit={handleAddDoc} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                  <h4 className="font-bold text-slate-700 text-sm mb-4">إضافة مستند جديد</h4>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">اسم المستند</label>
                    <input 
                      type="text" 
                      className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-200 outline-none"
                      placeholder="مثال: مذكرة دفاع، نسخة حكم..."
                      value={newDocName}
                      onChange={e => setNewDocName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">نوع التصنيف</label>
                    <select 
                      className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-200 outline-none"
                      value={newDocType}
                      onChange={e => setNewDocType(e.target.value)}
                    >
                      <option value="Official">وثيقة رسمية</option>
                      <option value="Draft">مسودة / مذكرة</option>
                      <option value="Proof">وسيلة إثبات</option>
                      <option value="Administrative">وثيقة إدارية</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                    <i className="fa-solid fa-cloud-arrow-up"></i>
                    أرشفة المستند
                  </button>
               </form>
            </div>

            <div className="lg:col-span-2">
               {loading ? <div className="p-20 text-center animate-pulse text-slate-300">جاري تحميل الأرشيف...</div> : (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {documents.map(doc => (
                      <div key={doc.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                               <i className={`fa-solid ${doc.name.endsWith('.pdf') ? 'fa-file-pdf' : 'fa-file-lines'}`}></i>
                            </div>
                            <div>
                               <p className="font-bold text-slate-800 text-xs truncate max-w-[120px]">{doc.name}</p>
                               <span className="text-[9px] text-slate-400 font-bold uppercase">{doc.type} • {new Date(doc.date).toLocaleDateString('ar-MA')}</span>
                            </div>
                         </div>
                         <div className="flex gap-2">
                            <button className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 hover:bg-indigo-600 hover:text-white transition-all"><i className="fa-solid fa-eye text-xs"></i></button>
                            <button onClick={() => handleDelete(doc.id)} className="w-8 h-8 rounded-lg bg-slate-50 text-rose-300 hover:bg-rose-500 hover:text-white transition-all"><i className="fa-solid fa-trash text-xs"></i></button>
                         </div>
                      </div>
                    ))}
                    {documents.length === 0 && (
                      <div className="md:col-span-2 py-20 text-center border-2 border-dashed border-slate-100 rounded-3xl opacity-30">
                         <i className="fa-solid fa-folder-open text-4xl mb-4"></i>
                         <p className="text-sm font-bold">الأرشيف فارغ حالياً</p>
                      </div>
                    )}
                 </div>
               )}
            </div>
          </div>
        ) : (
          <div className="py-20 text-center text-slate-400 italic font-bold">يرجى اختيار ملف من القائمة أعلاه للوصول إلى أرشيف مستنداته الرقمية.</div>
        )}
      </div>
    </div>
  );
};

export default DocumentArchive;
