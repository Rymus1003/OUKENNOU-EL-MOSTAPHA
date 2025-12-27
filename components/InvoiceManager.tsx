
import React, { useState, useEffect } from 'react';
import { api } from '../api';

const InvoiceManager: React.FC = () => {
  const [dossiers, setDossiers] = useState<any[]>([]);
  const [selectedDossier, setSelectedDossier] = useState<any>(null);
  const [cabinetInfo, setCabinetInfo] = useState<any>({
    name: 'مكتب الأستاذ المهني',
    ice: '001234567890012',
    if: '12345678',
    patent: '87654321',
    address: 'شارع الزرقطوني، الدار البيضاء'
  });

  useEffect(() => {
    api.getDossiers().then(setDossiers);
    api.getSettings().then(s => { if(s) setCabinetInfo(prev => ({...prev, ...s})); });
  }, []);

  const generateInvoice = () => {
    if (!selectedDossier) return alert('يرجى اختيار ملف أولاً');
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const totalHT = selectedDossier.montant_total || 0;
    const tva = totalHT * 0.10;
    const taxes = selectedDossier.taxes || 0;
    const totalTTC = totalHT + tva + taxes;

    const html = `
      <html dir="rtl" lang="ar">
        <head>
          <title>فاتورة رقم ${Date.now().toString().slice(-6)}</title>
          <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Tajawal', sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 40px; }
            .cabinet-info { text-align: right; }
            .invoice-details { text-align: left; }
            .client-box { border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px; background: #f8fafc; margin-bottom: 40px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
            th { background: #f1f5f9; padding: 15px; border: 1px solid #e2e8f0; text-align: center; }
            td { padding: 15px; border: 1px solid #e2e8f0; text-align: center; }
            .totals { float: left; width: 300px; }
            .totals-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f1f5f9; }
            .grand-total { background: #1e293b; color: white; padding: 15px; border-radius: 8px; margin-top: 10px; }
            .footer { margin-top: 100px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 10px; color: #94a3b8; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="cabinet-info">
              <h1 style="margin:0; color: #4f46e5;">${cabinetInfo.name}</h1>
              <p style="margin:5px 0;">المحامي بهيئة ${cabinetInfo.barreau || 'الدار البيضاء'}</p>
              <p style="font-size: 12px;">ICE: ${cabinetInfo.ice} | IF: ${cabinetInfo.if}</p>
              <p style="font-size: 12px;">العنوان: ${cabinetInfo.address}</p>
            </div>
            <div class="invoice-details">
              <h2 style="margin:0;">فاتورة أتعاب</h2>
              <p>رقم: INV-${Date.now().toString().slice(-6)}</p>
              <p>التاريخ: ${new Date().toLocaleDateString('ar-MA')}</p>
            </div>
          </div>

          <div class="client-box">
            <p style="margin:0; font-weight: bold; color: #64748b; font-size: 12px; margin-bottom: 5px;">موجهة إلى السيد(ة):</p>
            <h3 style="margin:0;">${selectedDossier.client_name}</h3>
            <p style="margin:5px 0; font-size: 13px;">CIN: ${selectedDossier.client_cin || '---'}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>البيان (ملف رقم ${selectedDossier.numero_mahakim})</th>
                <th>المبلغ HT</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="text-align: right;">أتعاب المحاماة عن ملف: ${selectedDossier.titre_affaire}</td>
                <td>${totalHT.toLocaleString()} د.م</td>
              </tr>
              <tr>
                <td style="text-align: right;">المصاريف والرسوم القضائية المؤداة</td>
                <td>${taxes.toLocaleString()} د.م</td>
              </tr>
            </tbody>
          </table>

          <div style="overflow: hidden;">
            <div class="totals">
              <div class="totals-row"><span>المجموع (HT)</span> <span>${totalHT.toLocaleString()} د.م</span></div>
              <div class="totals-row"><span>الضريبة (TVA 10%)</span> <span>${tva.toLocaleString()} د.م</span></div>
              <div class="totals-row"><span>المصاريف</span> <span>${taxes.toLocaleString()} د.م</span></div>
              <div class="grand-total totals-row">
                <span style="font-weight: bold;">المجموع الإجمالي (TTC)</span>
                <span style="font-weight: bold;">${totalTTC.toLocaleString()} د.م</span>
              </div>
            </div>
          </div>

          <div class="footer">
            <p>ICE Cabinet: ${cabinetInfo.ice} | القانون المطبق: التشريع الضريبي المغربي الجاري به العمل</p>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-right" dir="rtl">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
        <header className="flex items-center gap-5 mb-12">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <i className="fa-solid fa-file-invoice-dollar text-2xl text-emerald-400"></i>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-800">نظام الفوترة الضريبي</h3>
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-1">توليد فواتير قانونية مطابقة لمعايير المديرية العامة للضرائب</p>
          </div>
        </header>

        <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 mb-8 flex items-center gap-4">
           <i className="fa-solid fa-shield-check text-2xl text-emerald-500"></i>
           <p className="text-xs font-bold text-emerald-800 leading-relaxed">تنبيه: يتضمن هذا النظام احتساب الضريبة على القيمة المضافة (TVA) بنسبة 10% الخاصة بمهنة المحاماة في المغرب.</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-black text-slate-400 mb-3 pr-2 uppercase">اختر الملف لاستخراج فاتورته</label>
            <select 
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-lg font-bold focus:ring-4 focus:ring-emerald-50 outline-none transition-all text-indigo-700"
              onChange={(e) => setSelectedDossier(dossiers.find(d => d.id.toString() === e.target.value))}
            >
              <option value="">-- اختر ملفاً من الأرشيف --</option>
              {dossiers.map(d => <option key={d.id} value={d.id}>{d.numero_mahakim} - {d.titre_affaire}</option>)}
            </select>
          </div>

          {selectedDossier && (
            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-200 animate-in zoom-in-95 duration-500">
               <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">الموكل</p>
                    <p className="font-black text-slate-800">{selectedDossier.client_name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">المبلغ الصافي (HT)</p>
                    <p className="font-black text-slate-800">{Number(selectedDossier.montant_total || 0).toLocaleString()} د.م</p>
                  </div>
               </div>
               <button 
                onClick={generateInvoice}
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xl hover:bg-black shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-4"
               >
                <i className="fa-solid fa-print"></i>
                استخراج وطباعة الفاتورة النهائية
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceManager;
