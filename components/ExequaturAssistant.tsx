
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { api } from '../api';

const ExequaturAssistant: React.FC = () => {
  const [judgmentOrigin, setJudgmentOrigin] = useState('');
  const [matterType, setMatterType] = useState('civil');
  const [parties, setParties] = useState('');
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);

  const generateExequaturRequest = async () => {
    if (!judgmentOrigin || !parties) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        أنت محامٍ مغربي خبير في القانون الدولي الخاص.
        المطلوب: صياغة "مقال من أجل التذييل بالصيغة التنفيذية" (Exequatur) لحكم أجنبي صادر عن محاكم ${judgmentOrigin}.
        نوع المادة: ${matterType === 'civil' ? 'مادة مدنية/تجارية' : 'مادة الأحوال الشخصية (طلاق/نفقة)'}.
        أطراف النزاع: "${parties}".
        
        المتطلبات القانونية (الالتزام بالفصول 430 إلى 432 من قانون المسطرة المدنية):
        1. التحقق من اختصاص المحكمة الأجنبية وعدم مساس الحكم بالنظام العام المغربي.
        2. الإشارة إلى الاتفاقيات القضائية الدولية الثنائية (إذا وجدت بين المغرب و ${judgmentOrigin}) أو مبدأ المعاملة بالمثل.
        3. المطالبة بجعل الحكم نافذاً في مجموع التراب الوطني المغربي.
        4. ذكر قائمة المرفقات الإلزامية (نسخة أصلية من الحكم، شهادة عدم الطعن، ترجمة محلفة).
        
        اللغة: عربية قانونية رصينة ودقيقة.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });

      const content = response.text || 'فشل في توليد الطلب.';
      setDraft(content);

      await api.saveDraft({
        title: `تذييل بالصيغة التنفيذية: حكم ${judgmentOrigin}`,
        content: content,
        type: 'International'
      });
    } catch (error) {
      setDraft('حدث خطأ أثناء معالجة طلب التذييل.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-right" dir="rtl">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-50/50 via-transparent to-transparent pointer-events-none"></div>
        
        <header className="flex items-center gap-5 mb-10 relative z-10">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-2">
            <i className="fa-solid fa-globe text-2xl text-indigo-400"></i>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-800">مساعد التذييل بالصيغة التنفيذية</h3>
            <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest mt-1">تنفيذ الأحكام والقرارات الأجنبية بالمغرب (Exequatur)</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 relative z-10">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">الدولة مصدرة الحكم</label>
              <input 
                type="text" 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-3 font-bold focus:ring-4 focus:ring-indigo-50 outline-none"
                placeholder="مثال: فرنسا، إسبانيا، الإمارات..."
                value={judgmentOrigin}
                /* Fixed typo: changed setOrigin to setJudgmentOrigin */
                onChange={e => setJudgmentOrigin(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">نوع المادة القانونية</label>
              <select 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-3 font-bold focus:ring-4 focus:ring-indigo-50 outline-none"
                value={matterType}
                onChange={e => setMatterType(e.target.value)}
              >
                <option value="civil">مدني / تجاري</option>
                <option value="personal_status">أحوال شخصية (طلاق / حضانة)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">بيانات الأطراف والقرار</label>
            <textarea 
              className="w-full h-[140px] bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 text-sm font-bold focus:ring-4 focus:ring-indigo-50 outline-none resize-none shadow-inner"
              placeholder="أسماء الأطراف، رقم الحكم الأجنبي وتاريخ صدوره..."
              value={parties}
              onChange={e => setParties(e.target.value)}
            ></textarea>
          </div>
        </div>

        <button 
          onClick={generateExequaturRequest}
          disabled={loading || !judgmentOrigin}
          className="w-full bg-indigo-900 text-white py-5 rounded-2xl font-black text-xl hover:bg-black shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-4 relative z-10"
        >
          {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-file-signature"></i>}
          {loading ? 'جاري تحليل القوانين الدولية...' : 'توليد طلب التذييل بالصيغة التنفيذية'}
        </button>

        {draft && (
          <div className="mt-12 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-200 animate-in fade-in slide-in-from-bottom-5 duration-700">
             <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
                <h4 className="font-black text-slate-800 m-0 text-sm">مسودة المقال الافتتاحي:</h4>
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

export default ExequaturAssistant;
