
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { api } from '../api';

const InsuranceClaimAssistant: React.FC = () => {
  const [claimType, setClaimType] = useState('accident');
  const [facts, setFacts] = useState('');
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);

  const generateClaim = async () => {
    if (!facts) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const types: Record<string, string> = {
        'accident': 'حادثة سير (تعويض عن أضرار مادية وجسمانية)',
        'fire': 'حريق أو أضرار بممتلكات مؤمنة',
        'professional': 'مسؤولية مدنية مهنية',
      };

      const prompt = `
        أنت محامٍ مغربي خبير في قانون التأمين (قانون 17-99).
        المطلوب: صياغة "إنذار قبل التقاضي" أو "مذكرة مطالبة بالتعويض" موجهة لشركة التأمين بخصوص ${types[claimType]}.
        
        الوقائع الموفرة: "${facts}"
        
        المتطلبات:
        1. الإشارة إلى بنود عقد التأمين ومقتضيات قانون 17-99.
        2. المطالبة بتفعيل ضمانات العقد (Garanties contractuelles).
        3. التذكير بالآجال القانونية لتقديم عروض الصلح من طرف شركة التأمين.
        4. استخدام لغة قانونية حازمة تطالب بجبر الضرر الكامل للموكل.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });

      const content = response.text || 'خطأ في التوليد.';
      setDraft(content);

      await api.saveDraft({
        title: `مطالبة تأمين: ${types[claimType]}`,
        content: content,
        type: 'Insurance'
      });
    } catch (error) {
      setDraft('حدث خطأ أثناء معالجة مطالبة التأمين.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-right" dir="rtl">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-50/50 via-transparent to-transparent pointer-events-none"></div>
        
        <header className="flex items-center gap-5 mb-10 relative z-10">
          <div className="w-16 h-16 bg-blue-700 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-3">
            <i className="fa-solid fa-car-burst text-2xl"></i>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-800">مساعد منازعات التأمين</h3>
            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mt-1">تفعيل ضمانات عقود التأمين وجبر الأضرار (القانون 17-99)</p>
          </div>
        </header>

        <div className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 pr-2">نوع الضرر / التأمين</label>
              <div className="space-y-2">
                {['accident', 'fire', 'professional'].map(id => (
                  <button 
                    key={id}
                    onClick={() => setClaimType(id)}
                    className={`w-full text-right px-6 py-3 rounded-xl text-xs font-black transition-all border-2 ${claimType === id ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-slate-50 text-slate-500 border-slate-50'}`}
                  >
                    {id === 'accident' ? 'حوادث السير' : id === 'fire' ? 'الحرائق والكوارث' : 'المسؤولية المهنية'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 pr-2">شرح الوقائع (رقم المحضر، شركة التأمين، حجم الضرر...)</label>
              <textarea 
                className="w-full h-[160px] bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] p-6 text-sm font-medium focus:ring-4 focus:ring-blue-50 outline-none transition-all resize-none shadow-inner"
                placeholder="مثال: حادثة سير بتاريخ...، محضر رقم...، شركة تأمين الوفاء..."
                value={facts}
                onChange={e => setFacts(e.target.value)}
              ></textarea>
            </div>
          </div>

          <button 
            onClick={generateClaim}
            disabled={loading || !facts}
            className="w-full bg-blue-700 text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-800 shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-4"
          >
            {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-file-signature"></i>}
            {loading ? 'جاري صياغة المطالبة...' : 'توليد إنذار/مطالبة التعويض'}
          </button>
        </div>

        {draft && (
          <div className="mt-12 p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100 animate-in fade-in slide-in-from-bottom-5 duration-700 relative">
             <div className="flex justify-between items-center mb-6 border-b border-blue-200 pb-4">
                <h4 className="font-black text-slate-800 m-0 text-sm">مسودة المطالبة المقترحة:</h4>
                <button onClick={() => {navigator.clipboard.writeText(draft); alert('تم النسخ');}} className="text-blue-600 hover:scale-110 transition-transform"><i className="fa-solid fa-copy"></i></button>
             </div>
             <div className="prose prose-blue max-w-none whitespace-pre-wrap text-sm leading-loose font-medium text-slate-700">
                {draft}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InsuranceClaimAssistant;
