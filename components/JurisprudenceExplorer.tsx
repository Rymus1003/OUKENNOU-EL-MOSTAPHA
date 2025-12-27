
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const JurisprudenceExplorer: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string>('');
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Correct function name
  const searchJurisprudence = async () => {
    if (!query) return;
    setLoading(true);
    setResults('');
    setLinks([]);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `ابحث عن الاجتهادات القضائية المغربية وقرارات محكمة النقض المتعلقة بـ: ${query}. أريد ملخصاً للمبادئ القانونية المستخلصة وروابط للمصادر الرسمية إن وجدت.`,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      // Use .text property for string output
      setResults(response.text || 'لم يتم العثور على نتائج دقيقة.');
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (groundingChunks) {
        setLinks(groundingChunks);
      }
    } catch (error) {
      console.error(error);
      setResults('حدث خطأ أثناء البحث في القواعد البيانية القضائية.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-right" dir="rtl">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
        <div className="flex items-center gap-5 mb-10">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-2xl rotate-2">
            <i className="fa-solid fa-gavel text-2xl"></i>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-800">مستكشف الاجتهاد القضائي</h3>
            <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest mt-1">البحث في قرارات محكمة النقض والمحاكم العليا</p>
          </div>
        </div>

        <div className="relative group mb-8">
          <div className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none">
            <i className="fa-solid fa-magnifying-glass text-slate-300 group-focus-within:text-indigo-500 transition-colors"></i>
          </div>
          <input 
            type="text" 
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] px-14 py-5 text-lg font-bold focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all"
            placeholder="مثال: طرد تعسفي، نزاع حول ملكية عقارية، النفقة..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchJurisprudence()}
          />
        </div>

        <button 
          // Fixed typo: searchJurisperudence -> searchJurisprudence
          onClick={searchJurisprudence}
          disabled={loading || !query}
          className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-4 disabled:opacity-50"
        >
          {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-scale-unbalanced-flip"></i>}
          {loading ? 'جاري استخراج الاجتهادات...' : 'بحث في القواعد القضائية'}
        </button>

        {results && (
          <div className="mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200 relative">
               <div className="prose prose-slate max-w-none whitespace-pre-wrap text-slate-800 text-sm leading-relaxed font-medium">
                {results}
               </div>
            </div>

            {links.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {links.map((chunk, i) => (
                  <a 
                    key={i} 
                    href={chunk.web?.uri} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 hover:border-indigo-300 hover:shadow-md transition-all group"
                  >
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all">
                      <i className="fa-solid fa-link"></i>
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[10px] font-black text-slate-400 uppercase truncate">{chunk.web?.title || 'رابط المرجع'}</p>
                      <p className="text-[9px] text-indigo-400 truncate font-mono">{chunk.web?.uri}</p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JurisprudenceExplorer;
