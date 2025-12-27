
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { api } from '../api';

const ArbitrationClauseBuilder: React.FC = () => {
  const [scope, setScope] = useState('contract_disputes');
  const [arbType, setArbType] = useState('institutional');
  const [details, setDetails] = useState('');
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);

  const generateArbitrationClause = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        أنت مستشار في التحكيم التجاري المغربي. قم بصياغة "شرط تحكيم" (Arbitration Clause) متكامل ليتم إدراجه في عقد تجاري.
        المعطيات:
        - نوع التحكيم: ${arbType === 'institutional' ? 'تحكيم مؤسساتي (مثال: مركز الدار البيضاء للتحكيم)' : 'تحكيم حر (Ad hoc)'}
        - نطاق النزاعات: ${scope}
        - تفاصيل إضافية: ${details}
        
        المتطلبات:
        1. الالتزام بمقتضيات القانون 95-17 المغربي.
        2. تحديد القانون الواجب التطبيق (القانون المغربي).
        3. تحديد لغة التحكيم ومكان التحكيم.
        4. صياغة بند "استقلالية شرط التحكيم" عن العقد الأصلي.
        
        الصياغة بلغة قانونية دولية رصينة بالعربية.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });

      const content = response.text || 'خطأ في التوليد.';
      setDraft(content);

      await api.saveDraft({
        title: `بند تحكيم: ${scope}`,
        content: content,
        type: 'Corporate'
      });
    } catch (error) {
      setDraft('حدث خطأ أثناء صياغة بند التحكيم.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-right" dir="rtl">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
        <header className="flex items-center gap-5 mb-10">
          <div className="w-16 h-16 bg-indigo-900 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-2">
            <i className="fa-solid fa-handshake-angle text-2xl text-indigo-400"></i>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-800">منشئ بنود التحكيم</h3>
            <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest mt-1">صياغة اتفاقات التحكيم وفق القانون 95-17</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
           <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">نوع التحكيم</label>
                <div className="flex gap-2 p-1 bg-slate-50 rounded-2xl">
                   <button 
                    onClick={() => setArbType('institutional')}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${arbType === 'institutional' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                   >مؤسساتي</button>
                   <button 
                    onClick={() => setArbType('adhoc')}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${arbType === 'adhoc' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                   >حر (Ad hoc)</button>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">نطاق تطبيق التحكيم</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-3 font-bold focus:ring-4 focus:ring-indigo-50 outline-none"
                  placeholder="مثال: كافة النزاعات الناشئة عن تنفيذ هذا العقد..."
                  value={scope}
                  onChange={e => setScope(e.target.value)}
                />
              </div>
           </div>
           <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">شروط إضافية (عدد المحكمين، اللغة...)</label>
              <textarea 
                className="w-full h-[140px] bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 text-sm font-bold focus:ring-4 focus:ring-indigo-50 outline-none resize-none"
                placeholder="مثال: اللغة العربية، ثلاثة محكمين، مدينة الدار البيضاء..."
                value={details}
                onChange={e => setDetails(e.target.value)}
              ></textarea>
           </div>
        </div>

        <button 
          onClick={generateArbitrationClause}
          disabled={loading || !scope}
          className="w-full bg-indigo-900 text-white py-5 rounded-2xl font-black text-xl hover:bg-black shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-4"
        >
          {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-file-signature"></i>}
          {loading ? 'جاري بناء بند التحكيم...' : 'توليد شرط التحكيم القانوني'}
        </button>

        {draft && (
          <div className="mt-12 p-8 bg-indigo-50 rounded-[2.5rem] border border-indigo-100 animate-in fade-in slide-in-from-bottom-5 duration-700 relative">
             <div className="flex justify-between items-center mb-6 border-b border-indigo-200 pb-4">
                <h4 className="font-black text-slate-800 m-0 text-sm">البند المقترح للإدراج في العقد:</h4>
                <button onClick={() => {navigator.clipboard.writeText(draft); alert('تم النسخ');}} className="text-indigo-600 hover:scale-110 transition-transform"><i className="fa-solid fa-copy"></i></button>
             </div>
             <div className="prose prose-indigo max-w-none whitespace-pre-wrap text-sm leading-loose font-medium text-slate-700 italic">
                {draft}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArbitrationClauseBuilder;
