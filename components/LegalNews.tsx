
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

const LegalNews: React.FC = () => {
  const [news, setNews] = useState<string>('');
  const [loading, setLoading] = useState(true);
  /* Added state for grounding links to comply with search grounding guidelines */
  const [links, setLinks] = useState<any[]>([]);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    /* Reset links on new fetch */
    setLinks([]);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "أعطني ملخصاً لأحدث المستجدات القانونية والتشريعية في المغرب للأسبوع الحالي، بما في ذلك القوانين الجديدة في الجريدة الرسمية والقرارات الهامة. استخدم تنسيق نقاط واضحة.",
        config: {
          tools: [{ googleSearch: {} }],
        },
      });
      setNews(response.text || 'لا توجد مستجدات حالية.');

      /* Extract grounding sources as required by the guidelines */
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        setLinks(chunks);
      }
    } catch (error) {
      setNews('فشل تحميل الأخبار القانونية.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto text-right" dir="rtl">
      <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden relative">
         <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full blur-3xl -mr-16 -mt-16"></div>
         <header className="flex justify-between items-center mb-8 relative z-10">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <i className="fa-solid fa-newspaper text-xl"></i>
               </div>
               <h3 className="text-2xl font-black text-slate-800 m-0">المستجدات التشريعية</h3>
            </div>
            <button onClick={fetchNews} className="text-slate-400 hover:text-rose-600 transition-colors"><i className={`fa-solid fa-rotate ${loading ? 'fa-spin' : ''}`}></i></button>
         </header>

         {loading ? (
            <div className="space-y-4 py-10">
               <div className="h-4 bg-slate-100 rounded-full w-3/4 animate-pulse"></div>
               <div className="h-4 bg-slate-100 rounded-full w-full animate-pulse"></div>
               <div className="h-4 bg-slate-100 rounded-full w-1/2 animate-pulse"></div>
            </div>
         ) : (
            <div className="relative z-10">
               <div className="prose prose-slate max-w-none prose-sm font-medium leading-loose text-slate-700 whitespace-pre-wrap mb-8">
                  {news}
               </div>

               {/* Added rendering of grounding links to comply with search grounding requirements */}
               {links.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-slate-50">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">المصادر المرجعية المكتشفة:</p>
                    <div className="flex flex-wrap gap-2">
                      {links.map((chunk, i) => (
                        chunk.web?.uri && (
                          <a 
                            key={i} 
                            href={chunk.web.uri} 
                            target="_blank" 
                            rel="noreferrer"
                            className="bg-slate-50 hover:bg-rose-50 text-[10px] font-bold text-slate-500 hover:text-rose-600 px-3 py-1.5 rounded-xl border border-slate-100 transition-all flex items-center gap-2"
                          >
                            <i className="fa-solid fa-link"></i>
                            {chunk.web.title || 'مصدر خارجي'}
                          </a>
                        )
                      ))}
                    </div>
                  </div>
               )}
            </div>
         )}
         
         <div className="mt-10 pt-6 border-t border-slate-50 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">تحديث مباشر من الجريدة الرسمية ومحرك بحث جوجل</p>
         </div>
      </div>
    </div>
  );
};

export default LegalNews;
