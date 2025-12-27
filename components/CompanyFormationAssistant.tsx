
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { api } from '../api';

const CompanyFormationAssistant: React.FC = () => {
  const [companyData, setCompanyData] = useState({
    name: '',
    capital: '10000',
    type: 'SARL',
    activity: '',
    manager: '',
  });
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);

  const generateStatuts = async () => {
    if (!companyData.name || !companyData.activity) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        بصفتك مستشاراً في القانون التجاري المغربي، قم بصياغة مسودة "القانون الأساسي" (Statuts) لشركة من نوع ${companyData.type}.
        المعطيات:
        - التسمية التجارية: ${companyData.name}
        - رأس المال: ${companyData.capital} درهم.
        - الغرض الاجتماعي (النشاط): ${companyData.activity}
        - المسير: ${companyData.manager}
        
        المطلوب:
        1. الالتزام بمقتضيات القانون 5-96 المتعلق بشركة المسؤولية المحدودة.
        2. تضمين البنود الجوهرية (المقر، المدة، توزيع الحصص، صلاحيات التسيير، الجمعيات العامة).
        3. الصياغة بلغة قانونية رسمية دقيقة صالحة للتسجيل في السجل التجاري.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });

      const content = response.text || 'خطأ في التوليد.';
      setDraft(content);
      
      await api.saveDraft({
        title: `قانون أساسي: ${companyData.name}`,
        content: content,
        type: 'Corporate'
      });
    } catch (error) {
      setDraft('حدث خطأ أثناء صياغة القانون الأساسي.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-right" dir="rtl">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
        <header className="flex items-center gap-5 mb-10">
          <div className="w-16 h-16 bg-indigo-900 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-2">
            <i className="fa-solid fa-building-circle-check text-2xl text-indigo-400"></i>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-800">مساعد تأسيس الشركات</h3>
            <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest mt-1">صياغة الأنظمة الأساسية للشركات التجارية (SARL)</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">نوع الشركة</label>
              <select 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-3 font-bold focus:ring-4 focus:ring-indigo-50 outline-none"
                value={companyData.type}
                onChange={e => setCompanyData({...companyData, type: e.target.value})}
              >
                <option value="SARL">SARL (ش.م.م)</option>
                <option value="SARL AU">SARL AU (ش.م.م بشريك وحيد)</option>
                <option value="SNC">SNC (شركة التضامن)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">الاسم التجاري المقترح</label>
              <input 
                type="text" 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-3 font-bold focus:ring-4 focus:ring-indigo-50 outline-none"
                placeholder="أدخل اسم الشركة..."
                value={companyData.name}
                onChange={e => setCompanyData({...companyData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">رأس المال (د.م)</label>
              <input 
                type="number" 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-3 font-bold focus:ring-4 focus:ring-indigo-50 outline-none"
                value={companyData.capital}
                onChange={e => setCompanyData({...companyData, capital: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">اسم المسير (Gérant)</label>
              <input 
                type="text" 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-3 font-bold focus:ring-4 focus:ring-indigo-50 outline-none"
                placeholder="اسم المسير الكامل..."
                value={companyData.manager}
                onChange={e => setCompanyData({...companyData, manager: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">الغرض الاجتماعي (النشاط التجاري)</label>
              <textarea 
                className="w-full h-32 bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 text-sm font-bold focus:ring-4 focus:ring-indigo-50 outline-none transition-all resize-none"
                placeholder="مثال: استيراد وتصدير المواد الغذائية، تكنولوجيا المعلومات..."
                value={companyData.activity}
                onChange={e => setCompanyData({...companyData, activity: e.target.value})}
              ></textarea>
            </div>
          </div>
        </div>

        <button 
          onClick={generateStatuts}
          disabled={loading || !companyData.name}
          className="w-full bg-indigo-900 text-white py-5 rounded-2xl font-black text-xl hover:bg-black shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-4"
        >
          {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-file-contract text-indigo-400"></i>}
          {loading ? 'جاري صياغة الأنظمة...' : 'توليد القانون الأساسي للشركة'}
        </button>

        {draft && (
          <div className="mt-12 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-200 animate-in fade-in slide-in-from-bottom-5 duration-700 relative">
             <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h4 className="font-black text-slate-800 m-0 text-sm">مسودة القانون الأساسي (AI Draft):</h4>
                <button onClick={() => {navigator.clipboard.writeText(draft); alert('تم النسخ');}} className="text-indigo-600 hover:scale-110 transition-transform"><i className="fa-solid fa-copy"></i></button>
             </div>
             <div className="prose prose-indigo max-w-none whitespace-pre-wrap text-sm leading-loose font-medium text-slate-700">
                {draft}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyFormationAssistant;
