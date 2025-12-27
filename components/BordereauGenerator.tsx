
import React, { useState, useEffect } from 'react';
import { api } from '../api';

const BordereauGenerator: React.FC = () => {
  const [dossiers, setDossiers] = useState<any[]>([]);
  const [selectedDossier, setSelectedDossier] = useState<any>(null);
  const [pieces, setPieces] = useState<string[]>(['']);

  useEffect(() => {
    api.getDossiers().then(setDossiers);
  }, []);

  const addPiece = () => setPieces([...pieces, '']);
  const updatePiece = (idx: number, val: string) => {
    const newPieces = [...pieces];
    newPieces[idx] = val;
    setPieces(newPieces);
  };
  const removePiece = (idx: number) => setPieces(pieces.filter((_, i) => i !== idx));

  const handlePrint = () => {
    if (!selectedDossier) return alert('يرجى اختيار الملف أولاً');
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <html dir="rtl" lang="ar">
        <head>
          <title>لائحة المستندات - ${selectedDossier.numero_mahakim}</title>
          <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Tajawal', sans-serif; padding: 40px; color: #1e293b; }
            .header { border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 30px; text-align: center; }
            .court-info { margin-bottom: 30px; font-weight: bold; }
            .title { text-align: center; font-size: 20px; font-weight: bold; text-decoration: underline; margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #000; padding: 12px; text-align: center; }
            th { background: #f1f5f9; }
            .footer { margin-top: 50px; text-align: left; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h3>مكتب الأستاذ المحامي</h3>
            <p>المقبول لدى محكمة النقض</p>
          </div>
          <div class="court-info">
            <p>إلى السيد رئيس المحكمة: ${selectedDossier.tribunal}</p>
            <p>ملف رقم: ${selectedDossier.numero_mahakim}</p>
            <p>لفائدة: ${selectedDossier.client_name}</p>
            <p>ضد: ${selectedDossier.partie_adverse || '................'}</p>
          </div>
          <div class="title">لائحة المستندات والوثائق المرفقة</div>
          <table>
            <thead>
              <tr>
                <th width="10%">الرقم</th>
                <th>بيان المستند / الوثيقة</th>
                <th width="20%">عدد النسخ</th>
              </tr>
            </thead>
            <tbody>
              ${pieces.map((p, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td style="text-align: right;">${p}</td>
                  <td>نسخة واحدة</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">توقيع وخاتم المحامي</div>
          <script>window.print();</script>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-right" dir="rtl">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
          <i className="fa-solid fa-file-export text-emerald-500"></i>
          مولد لائحة المستندات (Bordereau)
        </h3>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-black text-slate-400 mb-2 uppercase">اختر الملف القضائي</label>
            <select 
              className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-emerald-50 outline-none transition-all font-bold text-indigo-700"
              onChange={(e) => setSelectedDossier(dossiers.find(d => d.id.toString() === e.target.value))}
            >
              <option value="">-- اختر ملفاً --</option>
              {dossiers.map(d => <option key={d.id} value={d.id}>{d.numero_mahakim} - {d.titre_affaire}</option>)}
            </select>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-black text-slate-400 mb-2 uppercase">قائمة الوثائق</label>
            {pieces.map((piece, idx) => (
              <div key={idx} className="flex gap-2 animate-in slide-in-from-right-2 duration-300">
                <span className="w-10 h-12 flex items-center justify-center bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-400">{idx + 1}</span>
                <input 
                  type="text" 
                  className="flex-1 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-50 outline-none transition-all font-medium"
                  placeholder="وصف الوثيقة (مثال: نسخة من عقد الكراء، محضر معاينة...)"
                  value={piece}
                  onChange={(e) => updatePiece(idx, e.target.value)}
                />
                <button onClick={() => removePiece(idx)} className="text-rose-400 hover:text-rose-600 transition-colors p-2"><i className="fa-solid fa-circle-minus text-xl"></i></button>
              </div>
            ))}
            <button 
              onClick={addPiece}
              className="mt-4 flex items-center gap-2 text-emerald-600 font-bold text-sm hover:text-emerald-700 transition-colors"
            >
              <i className="fa-solid fa-circle-plus"></i>
              إضافة وثيقة أخرى
            </button>
          </div>

          <div className="pt-8 border-t border-slate-50">
            <button 
              onClick={handlePrint}
              disabled={!selectedDossier || pieces.every(p => !p)}
              className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-xl hover:bg-emerald-700 transition-all transform active:scale-95 disabled:opacity-30 flex items-center justify-center gap-3"
            >
              <i className="fa-solid fa-print text-xl"></i>
              طباعة لائحة المستندات للمحكمة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BordereauGenerator;
