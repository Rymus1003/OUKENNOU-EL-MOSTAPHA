
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const CourtExplorer: React.FC = () => {
  const [city, setCity] = useState('');
  const [results, setResults] = useState<string>('');
  const [courtLinks, setCourtLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const findCourts = async () => {
    if (!city) return;
    setLoading(true);
    setResults('');
    setCourtLinks([]);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Use gemini-2.5-flash for maps grounding as per guidelines
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `ابحث عن جميع المحاكم (الابتدائية، الاستئناف، التجارية، الإدارية) في مدينة ${city} بالمغرب. أريد عناوينها الدقيقة، أرقام الهواتف، وموقعها على الخريطة.`,
        config: {
          tools: [{ googleMaps: {} }],
        },
      });

      setResults(response.text || 'لم يتم العثور على معلومات دقيقة لهذه المدينة.');
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (groundingChunks) {
        setCourtLinks(groundingChunks);
      }
    } catch (error) {
      console.error(error);
      setResults('حدث خطأ أثناء البحث عن المحاكم. يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 text-right" dir="rtl">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -ml-32 -mt-32"></div>
        
        <header className="flex items-center gap-5 mb-10 relative z-10">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-3">
            <i className="fa-solid fa-map-location-dot text-2xl"></i>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-800">الخريطة القضائية المغربية</h3>
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-1">تحديد مواقع المحاكم وجهات الاتصال الرسمية</p>
          </div>
        </header>

        <div className="flex flex-col md:flex-row gap-4 mb-8 relative z-10">
          <input 
            type="text" 
            className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-lg font-bold focus:ring-4 focus:ring-emerald-50 outline-none transition-all"
            placeholder="أدخل اسم المدينة (مثال: الدار البيضاء، مراكش، طنجة)..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && findCourts()}
          />
          <button 
            onClick={findCourts}
            disabled={loading || !city}
            className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-emerald-700 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
          >
            {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-location-crosshairs"></i>}
            {loading ? 'جاري البحث...' : 'تحديد المحاكم'}
          </button>
        </div>

        {results && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200">
               <h4 className="font-black text-slate-800 mb-6 flex items-center gap-2">
                 <i className="fa-solid fa-circle-info text-emerald-500"></i>
                 دليل المحاكم المكتشفة
               </h4>
               <div className="prose prose-slate max-w-none whitespace-pre-wrap text-sm leading-relaxed font-medium text-slate-700">
                {results}
               </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-black text-slate-800 mb-6 flex items-center gap-2">
                 <i className="fa-solid fa-map-pin text-rose-500"></i>
                 روابط المواقع الجغرافية
               </h4>
              {courtLinks.length > 0 ? courtLinks.map((chunk, i) => {
                if (!chunk.maps?.uri) return null;
                return (
                  <a 
                    key={i} 
                    href={chunk.maps.uri} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-100 hover:border-emerald-300 hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                        <i className="fa-solid fa-building-columns"></i>
                      </div>
                      <div>
                        <p className="font-black text-slate-800 text-sm">{chunk.maps.title || 'موقع المحكمة'}</p>
                        <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">عرض على خرائط جوجل</p>
                      </div>
                    </div>
                    <i className="fa-solid fa-chevron-left text-slate-300 group-hover:translate-x-[-5px] transition-transform"></i>
                  </a>
                );
              }) : (
                <div className="p-10 text-center border-2 border-dashed border-slate-100 rounded-3xl opacity-30 flex flex-col items-center gap-4">
                  <i className="fa-solid fa-map text-5xl"></i>
                  <p className="font-bold text-xs">سيتم عرض الروابط هنا عند توفرها</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourtExplorer;
