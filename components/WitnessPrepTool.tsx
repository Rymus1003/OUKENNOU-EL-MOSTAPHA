
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const WitnessPrepTool: React.FC = () => {
  const [caseFacts, setCaseFacts] = useState('');
  const [witnessRelation, setWitnessRelation] = useState('');
  const [guide, setGuide] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const generateGuide = async () => {
    if (!caseFacts) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        أنت محامٍ مغربي خبير في المساطر الشفوية. أريد التحضير لجلسة "البحث" (Enquête) لسماع الشهود.
        وقائع القضية: "${caseFacts}"
        علاقة الشاهد بالواقعة: "${witnessRelation}"
        
        المطلوب:
        1. استخراج أهم النقط التي يجب أن تنصب عليها الشهادة لخدمة مصلحة الموكل.
        2. صياغة 5 أسئلة جوهرية لطرحها على الشاهد.
        3. تذكير بالشكليات المتطلبة قانوناً (أداء القسم، عدم القرابة - الفصول 71-84 م.م).
        4. نصيحة حول كيفية مواجهة "شهادة الزور" أو التناقض في الأقوال.
        
        اللغة: عربية قانونية مهنية.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });

      setGuide(response.text || 'فشل في توليد دليل الشهادة.');
    } catch (error) {
      setGuide('خطأ في الاتصال بالذكاء الاصطناعي.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-right" dir="rtl">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden">
        <header className="flex items-center gap-5 mb-10">
          <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-3">
            <i className="fa-solid fa-users-viewfinder text-2xl"></i>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-800">مخطط سماع الشهود</h3>
            <p className="text-[10px] text-purple-600 font-bold uppercase tracking-widest mt-1">التحضير لجلسات البحث واستنطاق الشهود</p>
          </div>
        </header>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-400 uppercase pr-2">ملخص وقائع النزاع</label>
              <textarea 
                className="w-full h-32 bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 text-sm focus:ring-4 focus:ring-purple-50 outline-none transition-all resize-none"
                placeholder="اشرح موضوع النزاع باختصار..."
                value={caseFacts}
                onChange={e => setCaseFacts(e.target.value)}
              ></textarea>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-400 uppercase pr-2">صلة الشاهد بالموضوع</label>
              <textarea 
                className="w-full h-32 bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 text-sm focus:ring-4 focus:ring-purple-50 outline-none transition-all resize-none"
                placeholder="مثال: كان حاضراً وقت إبرام العقد، شاهد العيان على الحادث..."
                value={witnessRelation}
                onChange={e => setWitnessRelation(e.target.value)}
              ></textarea>
            </div>
          </div>

          <button 
            onClick={generateGuide}
            disabled={loading || !caseFacts}
            className="w-full bg-purple-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-purple-700 shadow-xl transition-all flex items-center justify-center gap-4"
          >
            {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-brain"></i>}
            {loading ? 'جاري رسم خطة الاستنطاق...' : 'توليد دليل استجواب الشاهد'}
          </button>
        </div>

        {guide && (
          <div className="mt-12 p-8 bg-purple-50 rounded-[2.5rem] border border-purple-100 animate-in fade-in slide-in-from-bottom-5 duration-700 relative">
             <div className="flex items-center gap-3 mb-6 border-b border-purple-200 pb-4">
                <i className="fa-solid fa-clipboard-question text-purple-600"></i>
                <h4 className="font-black text-slate-800 m-0 text-sm">دليل المحامي المقترح (AI Plan):</h4>
             </div>
             <div className="prose prose-purple max-w-none whitespace-pre-wrap text-sm leading-loose font-medium text-slate-700">
                {guide}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WitnessPrepTool;
