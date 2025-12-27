
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const LawLibrary: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const searchLaw = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `أنت مرجع قانوني مغربي. اشرح لي المادة القانونية أو المفهوم القانوني التالي بناءً على القوانين المغربية (مثل قانون المسطرة المدنية، القانون الجنائي، مدونة الأسرة، أو مدونة التجارة): ${query}. 
      يرجى ذكر رقم المادة واسم القانون المرتبط بها وشرح مبسط لتطبيقها.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });

      setResult(response.text || 'لم يتم العثور على شرح وافٍ.');
    } catch (error) {
      setResult('عذراً، حدث خطأ أثناء الوصول للمكتبة الرقمية.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-right" dir="rtl">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-3">
            <i className="fa-solid fa-book-bookmark text-2xl"></i>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800">المكتبة القانونية الرقمية</h3>
            <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest">البحث في نصوص التشريع المغربي</p>
          </div>
        </div>

        <div className="relative group">
          <input 
            type="text" 
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 pr-12 text-sm font-bold focus:ring-4 focus:ring-amber-50 focus:border-amber-400 outline-none transition-all"
            placeholder="ابحث عن مادة (مثال: المادة 32 من قانون المسطرة المدنية)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchLaw()}
          />
          <i className="fa-solid fa-magnifying-glass absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-amber-500 transition-colors"></i>
        </div>

        <button 
          onClick={searchLaw}
          disabled={loading || !query}
          className="mt-4 w-full bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-black transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {loading ? <i className="fa-solid fa-spinner fa-spin text-xl"></i> : <i className="fa-solid fa-brain"></i>}
          {loading ? 'جاري البحث في الأرشيف القانوني...' : 'استخراج النص والشرح القانوني'}
        </button>

        {result && (
          <div className="mt-8 p-8 bg-amber-50 rounded-3xl border border-amber-100 animate-in fade-in slide-in-from-top-4 duration-500 relative">
            <div className="absolute -top-4 right-8 bg-amber-500 text-white text-[10px] font-black px-4 py-1 rounded-full shadow-md uppercase tracking-widest">
              نتيجة البحث القانوني
            </div>
            <div className="prose prose-slate max-w-none whitespace-pre-wrap text-slate-800 text-sm leading-relaxed font-medium">
              {result}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: 'الجريدة الرسمية', icon: 'fa-landmark', link: 'http://www.sgg.gov.ma/arabe/BulletinOfficiel.aspx' },
          { title: 'بوابة عدالة', icon: 'fa-scale-balanced', link: 'http://adala.justice.gov.ma/' },
          { title: 'محاكم المغرب', icon: 'fa-globe', link: 'https://www.mahakim.ma/' }
        ].map((ref, i) => (
          <a key={i} href={ref.link} target="_blank" rel="noreferrer" className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-4 hover:shadow-md transition-all group">
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-amber-500 group-hover:text-white transition-all">
              <i className={`fa-solid ${ref.icon}`}></i>
            </div>
            <span className="text-xs font-black text-slate-600">{ref.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default LawLibrary;
