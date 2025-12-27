
import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { GoogleGenAI } from "@google/genai";

const DocumentGenerator: React.FC = () => {
  const [dossiers, setDossiers] = useState<any[]>([]);
  const [selectedDossier, setSelectedDossier] = useState<any>(null);
  const [docType, setDocType] = useState('requete');
  const [isGenerating, setIsGenerating] = useState(false);
  const [content, setContent] = useState('');

  useEffect(() => {
    api.getDossiers().then(setDossiers).catch(console.error);
  }, []);

  const templates = [
    { id: 'requete', label: 'مقال افتتاحي', prompt: 'صغ مقالاً افتتاحياً رسمياً للمحكمة الابتدائية' },
    { id: 'appel', label: 'مقال استئنافي', prompt: 'صغ مقالاً استئنافياً يطعن في حكم ابتدائي مع ذكر أسباب الاستئناف القانونية' },
    { id: 'conclusion', label: 'مذكرة جوابية', prompt: 'صغ مذكرة جوابية قانونية للرد على ادعاءات الخصم في إطار تبادل المذكرات' },
    { id: 'notice', label: 'إنذار مباشر', prompt: 'صغ إنذاراً رسمياً قبل التقاضي (Mise en demeure) مع مهلة 15 يوماً' },
    { id: 'cassation', label: 'مذكرة نقض', prompt: 'صغ مسودة عريضة نقض موجهة لمحكمة النقض بالرباط بناء على خرق القانون' },
  ];

  const generateDoc = async () => {
    if (!selectedDossier) return alert('يرجى اختيار الملف أولاً');
    setIsGenerating(true);
    try {
      const template = templates.find(t => t.id === docType);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        بصفتك محامياً خبيراً في القانون المغربي والمسطرة المدنية والجنائية، ${template?.prompt} بالمعطيات التالية:
        نوع القضية: ${selectedDossier.type_affaire}
        موضوعها: ${selectedDossier.titre_affaire}
        الموكل (المدعي/المستأنف): ${selectedDossier.client_name} (CIN: ${selectedDossier.client_cin})
        الطرف الخصم: ${selectedDossier.partie_adverse || '---'}
        المحكمة المعنية: ${selectedDossier.tribunal}
        رقم الملف بالمحكمة: ${selectedDossier.numero_mahakim}
        
        تأكد من استخدام العبارات الرسمية (مثل: لهاته الأسباب، يلتمس من هيئتكم الموقرة، بناء عليه)، واجعل الصياغة رصينة وتلتزم بالشروط الشكلية للمذكرات في المغرب.
      `;

      const result = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });
      setContent(result.text || '');
    } catch (error) {
      alert('فشل توليد الوثيقة. تأكد من إعدادات الذكاء الاصطناعي.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html dir="rtl" lang="ar">
        <head>
          <title>وثيقة قانونية - ${selectedDossier?.numero_mahakim}</title>
          <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Tajawal', sans-serif; padding: 60px; line-height: 1.8; color: #1a202c; }
            .header-office { text-align: right; margin-bottom: 40px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
            .header-court { text-align: center; margin-bottom: 40px; font-weight: bold; }
            .content { white-space: pre-wrap; font-size: 15px; text-align: justify; }
            .footer { margin-top: 60px; text-align: left; }
            @media print { body { padding: 30px; } }
          </style>
        </head>
        <body>
          <div class="header-office">
            <h2 style="margin:0">مكتب الأستاذ المحامي</h2>
            <p style="margin:5px 0">المقبول لدى محكمة النقض</p>
            <p style="margin:5px 0; font-size: 12px; color: #666">تاريخ الصدور: ${new Date().toLocaleDateString('ar-MA')}</p>
          </div>
          <div class="header-court">
            إلى السيد رئيس هيئة المحكمة بـ: ${selectedDossier.tribunal}
          </div>
          <div class="content">${content}</div>
          <div class="footer">
            <p>توقيع وخاتم الأستاذ:</p>
            <br/><br/>
            ............................
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-right" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <i className="fa-solid fa-file-signature text-indigo-500"></i>
            صياغة وثيقة قانونية
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-400 mb-2 uppercase">الملف المرجعي</label>
              <select 
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-bold"
                onChange={(e) => setSelectedDossier(dossiers.find(d => d.id.toString() === e.target.value))}
              >
                <option value="">-- اختر ملفاً --</option>
                {dossiers.map(d => (
                  <option key={d.id} value={d.id}>{d.numero_mahakim} - {d.client_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 mb-2 uppercase">نوع المحرر</label>
              <div className="flex flex-col gap-2">
                {templates.map(t => (
                  <button 
                    key={t.id}
                    onClick={() => setDocType(t.id)}
                    className={`text-right px-4 py-3 rounded-xl text-xs font-bold border transition-all ${docType === t.id ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50'}`}
                  >
                    <i className={`fa-solid ${docType === t.id ? 'fa-circle-check' : 'fa-circle'} ml-2 opacity-50`}></i>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={generateDoc}
              disabled={isGenerating || !selectedDossier}
              className="w-full mt-6 bg-slate-900 text-white py-4 rounded-xl font-black shadow-xl hover:bg-black disabled:opacity-50 flex items-center justify-center gap-2 transition-all transform active:scale-95"
            >
              {isGenerating ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles text-indigo-400"></i>}
              {isGenerating ? 'جاري الصياغة القانونية...' : 'توليد المسودة بالذكاء الاصطناعي'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden min-h-[700px] flex flex-col relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <header className="bg-white/80 backdrop-blur-md p-6 border-b flex justify-between items-center relative z-10">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400"></span>
                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                <span className="text-xs font-black text-slate-400 mr-4 uppercase tracking-widest">معاينة المحرر</span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handlePrint}
                  disabled={!content}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-xs font-black hover:bg-indigo-700 disabled:opacity-30 shadow-lg shadow-indigo-100 transition-all flex items-center gap-2"
                >
                  <i className="fa-solid fa-print"></i>
                  طباعة الوثيقة
                </button>
              </div>
            </header>
            <textarea 
              className="flex-1 p-12 outline-none resize-none font-serif text-lg leading-relaxed text-slate-800 bg-transparent relative z-10"
              placeholder="اكتب أو انتظر توليد النص هنا..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentGenerator;
