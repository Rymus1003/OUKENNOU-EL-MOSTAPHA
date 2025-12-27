
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { api } from '../api';

const LegalAgreementBuilder: React.FC = () => {
  const [agreementType, setAgreementType] = useState('lease');
  const [parties, setParties] = useState('');
  const [terms, setTerms] = useState('');
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);

  const generateAgreement = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const types: Record<string, string> = {
        'lease': 'عقد كراء (سكنى أو تجاري)',
        'sale_promise': 'وعد بالبيع (Compromis de vente)',
        'settlement': 'عقد صلح اتفاقي (Transaction)',
        'partnership': 'اتفاقية شراكة مهنية'
      };

      const prompt = `
        أنت محامٍ مغربي خبير في العقود والالتزامات. قم بصياغة مسودة لـ "${types[agreementType]}".
        الأطراف: "${parties}"
        البنود الجوهرية المتفق عليها: "${terms}"
        
        المطلوب:
        1. الالتزام بمقتضيات قانون الالتزامات والعقود (D.O.C) والقوانين الخاصة (مثل قانون 67.12 للكراء السكني أو 49.16 للكراء التجاري).
        2. صياغة بنود حماية قانونية للموكل (الشرط الفاسخ، غرامات التأخير، الاختصاص القضائي).
        3. استخدام لغة عربية رسمية دقيقة صالحة للمصادقة على التوقيع (Légalisation).
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });

      const content = response.text || 'خطأ في التوليد.';
      setDraft(content);

      await api.saveDraft({
        title: `${types[agreementType]}: ${parties.substring(0, 20)}`,
        content: content,
        type: 'Agreement'
      });
    } catch (error) {
      setDraft('حدث خطأ أثناء صياغة العقد.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-right" dir="rtl">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
        <header className="flex items-center gap-5 mb-10">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-2">
            <i className="fa-solid fa-file-signature text-2xl"></i>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-800">منشئ الاتفاقيات والعقود</h3>
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-1">صياغة العقود الاتفاقية والصلح بلمسة احترافية</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
           <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">نوع الاتفاقية</label>
                <select 
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-3 font-bold focus:ring-4 focus:ring-emerald-50 outline-none"
                  value={agreementType}
                  onChange={e => setAgreementType(e.target.value)}
                >
                  <option value="lease">عقد كراء (سكنى/تجاري)</option>
                  <option value="sale_promise">وعد بالبيع عقاري</option>
                  <option value="settlement">عقد صلح نهائي</option>
                  <option value="partnership">اتفاقية شراكة</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">بيانات الأطراف</label>
                <textarea 
                  className="w-full h-24 bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 text-sm font-bold focus:ring-4 focus:ring-emerald-50 outline-none resize-none"
                  placeholder="أسماء الأطراف، أرقام CIN، العناوين..."
                  value={parties}
                  onChange={e => setParties(e.target.value)}
                ></textarea>
              </div>
           </div>
           <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">شروط خاصة أو مبالغ متفق عليها</label>
              <textarea 
                className="w-full h-[180px] bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 text-sm font-bold focus:ring-4 focus:ring-emerald-50 outline-none resize-none"
                placeholder="مثال: السومة الكرائية 3000 درهم، مدة العقد سنتان، تسبيق شهرين..."
                value={terms}
                onChange={e => setTerms(e.target.value)}
              ></textarea>
           </div>
        </div>

        <button 
          onClick={generateAgreement}
          disabled={loading || !parties}
          className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-emerald-700 shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-4"
        >
          {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-file-contract"></i>}
          {loading ? 'جاري بناء العقد...' : 'توليد مسودة الاتفاقية النهائية'}
        </button>

        {draft && (
          <div className="mt-12 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-200 animate-in fade-in slide-in-from-bottom-5 duration-700 relative">
             <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h4 className="font-black text-slate-800 m-0 text-sm">مسودة العقد المقترحة:</h4>
                <div className="flex gap-2">
                   <button onClick={() => {navigator.clipboard.writeText(draft); alert('تم النسخ');}} className="text-emerald-600 hover:scale-110 transition-transform"><i className="fa-solid fa-copy"></i></button>
                   <button onClick={() => window.print()} className="text-slate-400 hover:text-indigo-600 transition-colors"><i className="fa-solid fa-print"></i></button>
                </div>
             </div>
             <div className="prose prose-emerald max-w-none whitespace-pre-wrap text-sm leading-loose font-medium text-slate-700">
                {draft}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LegalAgreementBuilder;
