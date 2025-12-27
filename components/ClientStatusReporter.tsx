
import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { GoogleGenAI } from "@google/genai";

const ClientStatusReporter: React.FC = () => {
  const [dossiers, setDossiers] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getDossiers().then(setDossiers);
  }, []);

  const generateReport = async () => {
    if (!selectedId) return;
    setLoading(true);
    try {
      const allDossiers = await api.getDossiers();
      const dossier = allDossiers.find((d: any) => d.id.toString() === selectedId);
      const allHearings = await api.getAudiences();
      const hearings = allHearings.filter((h: any) => h.dossier_id.toString() === selectedId);
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        أنت مساعد قانوني محترف. قم بصياغة "تقرير وضعية ملف" موجه للموكل: ${dossier.client_name}.
        بيانات الملف:
        - الموضوع: ${dossier.titre_affaire}
        - رقم المحكمة: ${dossier.numero_mahakim}
        - سجل الجلسات الأخيرة: ${hearings.map(h => `تاريخ ${h.date_audience}: ${h.decision_intermediaire}`).join(' | ')}
        - الوضعية المالية: الباقي هو ${dossier.reste} درهم.
        
        المطلوب:
        1. كتابة التقرير بأسلوب طمأنة واحترافية.
        2. تلخيص ما تم في الجلسات بكلمات بسيطة يفهمها الشخص العادي.
        3. ذكر الإجراء القادم وموعده.
        4. اللغة: عربية مغربية مهذبة (أو عربية فصحى مبسطة).
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setReport(response.text || 'تعذر توليد التقرير.');
    } catch (error) {
      setReport('خطأ في الاتصال بالنظام الذكي.');
    } finally {
      setLoading(false);
    }
  };

  const copyAndSend = () => {
    navigator.clipboard.writeText(report);
    alert('تم نسخ التقرير. يمكنك الآن لصقه في محادثة الواتساب مع الموكل.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-right" dir="rtl">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
        <header className="flex items-center gap-5 mb-10">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-2">
            <i className="fa-solid fa-clipboard-check text-2xl"></i>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-800">مخبر وضعية الملفات</h3>
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-1">توليد تقارير سريعة للموكلين بالذكاء الاصطناعي</p>
          </div>
        </header>

        <div className="space-y-8">
          <div>
            <label className="block text-xs font-black text-slate-400 mb-3 pr-2 uppercase">اختر الملف لتوليد تقرير وضعيته</label>
            <select 
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-lg font-bold focus:ring-4 focus:ring-emerald-50 outline-none transition-all text-indigo-700"
              value={selectedId}
              onChange={e => setSelectedId(e.target.value)}
            >
              <option value="">-- ابحث عن ملف --</option>
              {dossiers.map(d => <option key={d.id} value={d.id}>{d.numero_mahakim} - {d.client_name}</option>)}
            </select>
          </div>

          <button 
            onClick={generateReport}
            disabled={loading || !selectedId}
            className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-emerald-700 shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-4"
          >
            {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
            {loading ? 'جاري تجميع بيانات الملف...' : 'توليد تقرير الموكل'}
          </button>
        </div>

        {report && (
          <div className="mt-12 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-200 animate-in fade-in slide-in-from-bottom-5 duration-700 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500"></div>
             <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
                <h4 className="font-black text-slate-800 m-0 text-sm">التقرير المقترح للموكل:</h4>
                <button onClick={copyAndSend} className="text-emerald-600 hover:text-emerald-700 font-bold text-xs flex items-center gap-2 transition-colors">
                   <i className="fa-solid fa-copy"></i> نسخ للواتساب
                </button>
             </div>
             <div className="prose prose-slate max-w-none whitespace-pre-wrap text-sm leading-loose font-medium text-slate-700">
                {report}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientStatusReporter;
