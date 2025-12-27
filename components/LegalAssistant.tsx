
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const LegalAssistant: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [groundingLinks, setGroundingLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'maps'>('chat');

  const analyzeCase = async () => {
    if (!prompt) return;
    setLoading(true);
    setResponse('');
    setGroundingLinks([]);
    try {
      // Use named parameter for apiKey
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const config: any = {
        // Use gemini-2.5-flash for maps grounding as per guidelines
        model: activeTab === 'maps' ? 'gemini-2.5-flash' : 'gemini-3-pro-preview',
        contents: activeTab === 'maps' 
          ? `ابحث عن المحاكم ومواقعها وتفاصيل الاتصال بها في: ${prompt}`
          : `أنت مساعد قانوني خبير في التشريع المغربي. قم بتحليل النص التالي أو صياغة المذكرة المطلوبة بناءً على القانون المغربي والفقه القضائي الحالي: ${prompt}`,
        config: {
          tools: activeTab === 'maps' ? [{ googleMaps: {} }] : [{ googleSearch: {} }],
        }
      };

      const result = await ai.models.generateContent(config);
      // Access text as a property
      setResponse(result.text || 'لم يتم العثور على رد دقيق.');
      
      // Extract grounding sources
      const chunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        setGroundingLinks(chunks);
      }
    } catch (error) {
      console.error(error);
      setResponse('حدث خطأ أثناء معالجة الطلب. يرجى التأكد من صلاحية مفتاح API وتفعيل خدمات البحث والخرائط.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-right" dir="rtl">
      <div className="w3-card-4 bg-white rounded-2xl overflow-hidden shadow-xl border-t-4 border-purple-500">
        <header className="bg-purple-50 p-6 border-b flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg transform rotate-3">
               <i className="fa-solid fa-wand-magic-sparkles text-xl"></i>
             </div>
             <div>
                <h3 className="font-black text-purple-900 m-0 text-xl">المساعد القانوني الذكي</h3>
                <p className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">Powered by Gemini AI</p>
             </div>
          </div>
          <div className="flex gap-1 p-1 bg-purple-100 rounded-xl">
            <button 
              onClick={() => setActiveTab('chat')}
              className={`px-6 py-2 rounded-lg text-xs font-black transition-all ${activeTab === 'chat' ? 'bg-white text-purple-600 shadow-md' : 'text-purple-400 hover:text-purple-600'}`}
            >
              <i className="fa-solid fa-comments-legal ml-2"></i>
              استشارات قانونية
            </button>
            <button 
              onClick={() => setActiveTab('maps')}
              className={`px-6 py-2 rounded-lg text-xs font-black transition-all ${activeTab === 'maps' ? 'bg-white text-purple-600 shadow-md' : 'text-purple-400 hover:text-purple-600'}`}
            >
              <i className="fa-solid fa-map-location-dot ml-2"></i>
              تحديد المحاكم
            </button>
          </div>
        </header>

        <div className="p-8 space-y-6">
          <div className="bg-slate-50 p-5 rounded-2xl border-r-4 border-purple-300">
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              {activeTab === 'chat' 
                ? "يمكنك السؤال عن المساطر القانونية، آجال الطعون، أو طلب تلخيص لنص قانوني مغربي."
                : "ابحث عن عناوين المحاكم، أرقام هواتفها، أو المسافة إليها (مثال: محكمة الاستئناف بالدار البيضاء)."}
            </p>
          </div>

          <div className="relative">
            <textarea 
              className="w-full h-40 border border-slate-200 rounded-2xl p-6 focus:ring-4 focus:ring-purple-50 focus:border-purple-500 outline-none transition-all resize-none shadow-inner text-sm leading-relaxed"
              placeholder={activeTab === 'chat' ? "اشرح الحالة القانونية أو موضوع المذكرة هنا..." : "أدخل اسم المدينة أو المحكمة المراد البحث عنها..."}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            ></textarea>
            <div className="absolute bottom-4 left-4 text-[10px] text-slate-300 font-bold uppercase">
              {prompt.length} حرف
            </div>
          </div>

          <button 
            onClick={analyzeCase}
            disabled={loading || !prompt}
            className="w-full bg-gradient-to-l from-purple-600 to-indigo-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-purple-200 hover:shadow-purple-300 transition-all transform active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <i className="fa-solid fa-spinner fa-spin text-xl"></i> : <i className="fa-solid fa-bolt-lightning"></i>}
            {loading ? 'جاري تحليل النص قانونياً...' : 'توليد الاستجابة الذكية'}
          </button>

          {response && (
            <div className="mt-8 p-8 bg-slate-900 text-slate-100 rounded-3xl shadow-2xl border border-slate-800 animate-in slide-in-from-bottom-4 duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-2 h-full bg-purple-500"></div>
              <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
                <i className="fa-solid fa-scale-balanced text-purple-400"></i>
                <span className="font-black text-sm tracking-wide">التحليل القانوني المقترح:</span>
              </div>
              <div className="prose prose-invert max-w-none whitespace-pre-wrap text-sm leading-8 font-medium text-slate-300">
                {response}
              </div>

              {groundingLinks.length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-800">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">المصادر والمراجع المعتمدة:</p>
                  <div className="flex flex-wrap gap-3">
                    {groundingLinks.map((chunk, i) => {
                      const link = chunk.web?.uri || chunk.maps?.uri;
                      const title = chunk.web?.title || chunk.maps?.title || "عرض التفاصيل";
                      if (!link) return null;
                      return (
                        <a 
                          key={i} 
                          href={link} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="bg-slate-800/50 hover:bg-purple-900/30 px-4 py-2 rounded-xl text-[10px] text-purple-300 border border-slate-700 transition-all flex items-center gap-2 group"
                        >
                          <i className={`fa-solid ${chunk.maps ? 'fa-map-pin' : 'fa-arrow-up-right-from-square'} group-hover:scale-125 transition-transform`}></i>
                          {title}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <p className="text-[9px] text-slate-400 text-center font-bold uppercase tracking-widest">
        تنبيه: المعلومات المقدمة من الذكاء الاصطناعي هي للاسترشاد فقط ويجب مراجعتها من طرف محامٍ مؤهل.
      </p>
    </div>
  );
};

export default LegalAssistant;
