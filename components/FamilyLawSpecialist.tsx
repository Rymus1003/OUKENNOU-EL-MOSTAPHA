
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { api } from '../api';

const FamilyLawSpecialist: React.FC = () => {
  const [caseType, setCaseType] = useState('shiqaq');
  const [facts, setFacts] = useState('');
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);

  const generateFamilyPetition = async () => {
    if (!facts) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const types: Record<string, string> = {
        'shiqaq': 'مقال طلاق للشقاق (Divorce pour désunion)',
        'alimony': 'دعوى النفقة وإهمال الأسرة',
        'custody': 'دعوى إسناد أو إسقاط الحضانة',
        'inheritance': 'مقال في مادة الإرث وقسمة التركة'
      };

      const prompt = `
        أنت محامٍ مغربي خبير في قضايا الأسرة ومدونة الأسرة.
        قم بصياغة "${types[caseType]}" موجه للسيد رئيس المحكمة الابتدائية - قسم قضاء الأسرة.
        
        الوقائع الموفرة: "${facts}"
        
        المتطلبات القانونية والشرعية:
        1. الإشارة إلى مواد مدونة الأسرة (مثلاً المواد 94-97 للشقاق، أو المواد 163-192 للحضانة والنفقة).
        2. التركيز على الشكليات الإلزامية: صفة الأطراف، البيانات الشخصية، ومحاولة الصلح الإجبارية.
        3. في دعوى الشقاق: صياغة أسباب "الشقاق" بأسلوب قانوني بليغ يحافظ على كرامة الأطراف ويوضح استحالة العشرة.
        4. في النفقة: ذكر معايير التقدير (الدخل، الوسط الاجتماعي، غلاء المعيشة).
        5. الطلبات الختامية: شمولية كافة الحقوق (نفقة، سكن، مستحقات الزوجة، أجرة الحضانة).
        
        اللغة: عربية فصحى، رصينة، وتراعي خصوصية القضاء الأسري المغربي.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });

      const content = response.text || 'فشل في توليد المقال الأسري.';
      setDraft(content);

      await api.saveDraft({
        title: `${types[caseType]} - ${new Date().toLocaleDateString('ar-MA')}`,
        content: content,
        type: 'Family'
      });
    } catch (error) {
      setDraft('حدث خطأ أثناء معالجة الملف الأسري.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-right" dir="rtl">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-pink-50/50 via-transparent to-transparent pointer-events-none"></div>
        
        <header className="flex items-center gap-5 mb-10 relative z-10">
          <div className="w-16 h-16 bg-pink-600 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-2">
            <i className="fa-solid fa-people-roof text-2xl"></i>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-800">مساعد قضاء الأسرة</h3>
            <p className="text-[10px] text-pink-600 font-bold uppercase tracking-widest mt-1">تسيير دعاوى الأحوال الشخصية والنفقة (مدونة الأسرة)</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 relative z-10">
          <div className="space-y-4">
            <label className="block text-[10px] font-black text-slate-400 uppercase pr-2">نوع المادة الأسرية</label>
            <div className="grid grid-cols-1 gap-3">
              {[
                { id: 'shiqaq', label: 'طلاق للشقاق' },
                { id: 'alimony', label: 'النفقة والسكن' },
                { id: 'custody', label: 'الحضانة والزيارة' },
                { id: 'inheritance', label: 'مادة الإرث' }
              ].map(t => (
                <button 
                  key={t.id}
                  onClick={() => setCaseType(t.id)}
                  className={`text-right px-6 py-4 rounded-2xl text-xs font-black transition-all border-2 ${caseType === t.id ? 'bg-pink-600 text-white border-pink-600 shadow-lg' : 'bg-white text-slate-500 border-slate-50 hover:border-pink-100'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <label className="block text-[10px] font-black text-slate-400 uppercase pr-2">وقائع الحالة (الزواج، الأبناء، أسباب النزاع...)</label>
            <textarea 
              className="w-full h-[240px] bg-slate-50 border-2 border-slate-100 rounded-[2rem] p-6 text-sm font-medium focus:ring-4 focus:ring-pink-50 outline-none transition-all resize-none shadow-inner"
              placeholder="أدخل تفاصيل الحالة بوضوح (تاريخ الزواج، عدد الأبناء، الدخل الشهري، أسباب الطلاق...)"
              value={facts}
              onChange={e => setFacts(e.target.value)}
            ></textarea>
          </div>
        </div>

        <button 
          onClick={generateFamilyPetition}
          disabled={loading || !facts}
          className="w-full bg-pink-700 text-white py-5 rounded-2xl font-black text-xl hover:bg-pink-800 shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-4 relative z-10"
        >
          {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-file-heart"></i>}
          {loading ? 'جاري الصياغة القانونية...' : 'توليد مقال دعوى الأسرة'}
        </button>

        {draft && (
          <div className="mt-12 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-200 animate-in fade-in slide-in-from-bottom-5 duration-700">
             <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h4 className="font-black text-slate-800 m-0 text-sm">مسودة المقال القضائي (أسرة):</h4>
                <button onClick={() => {navigator.clipboard.writeText(draft); alert('تم النسخ');}} className="text-pink-600 hover:scale-110 transition-transform"><i className="fa-solid fa-copy"></i></button>
             </div>
             <div className="prose prose-pink max-w-none whitespace-pre-wrap text-sm leading-[2.2] font-medium text-slate-700">
                {draft}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FamilyLawSpecialist;
