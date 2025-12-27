
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const LegalTranslator: React.FC = () => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [direction, setDirection] = useState<'ar-fr' | 'fr-ar'>('ar-fr');

  const translate = async () => {
    if (!sourceText) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        أنت مترجم قانوني محلف خبير في القانون المغربي. قم بترجمة النص التالي من ${direction === 'ar-fr' ? 'العربية إلى الفرنسية' : 'الفرنسية إلى العربية'}.
        يجب الالتزام بالمصطلحات القانونية المعمول بها في المحاكم المغربية (مثال: محكمة الاستئناف -> Cour d'Appel، مقال افتتاحي -> Requête introductive d'instance).
        النص المراد ترجمته:
        "${sourceText}"
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setTranslatedText(response.text || 'فشلت عملية الترجمة.');
    } catch (error) {
      console.error(error);
      setTranslatedText('حدث خطأ أثناء الاتصال بخدمة الترجمة الذكية.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(translatedText);
    alert('تم نسخ النص المترجم');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 text-right" dir="rtl">
      <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden relative">
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <i className="fa-solid fa-language text-2xl"></i>
            </div>
            <div>
              <h3 className="text-3xl font-black text-slate-800">المترجم القانوني المتخصص</h3>
              <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mt-1">ترجمة احترافية للمحاضر والمذكرات (AR ↔ FR)</p>
            </div>
          </div>
          <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
            <button 
              onClick={() => setDirection('ar-fr')}
              className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${direction === 'ar-fr' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
            >عربي ← فرنسي</button>
            <button 
              onClick={() => setDirection('fr-ar')}
              className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${direction === 'fr-ar' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
            >فرنسي ← عربي</button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="block text-[10px] font-black text-slate-400 uppercase pr-2">النص الأصلي</label>
            <textarea 
              className={`w-full h-80 p-6 rounded-3xl border-2 border-slate-50 focus:border-blue-200 outline-none transition-all resize-none text-sm leading-relaxed ${direction === 'fr-ar' ? 'text-left font-sans' : 'text-right font-serif'}`}
              dir={direction === 'fr-ar' ? 'ltr' : 'rtl'}
              placeholder={direction === 'ar-fr' ? 'اكتب النص القانوني بالعربية هنا...' : 'Écrivez le texte juridique ici...'}
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
            ></textarea>
          </div>

          <div className="space-y-4 relative">
            <label className="block text-[10px] font-black text-slate-400 uppercase pr-2">الترجمة القانونية المقترحة</label>
            <div className={`w-full h-80 p-6 rounded-3xl bg-slate-50 border-2 border-slate-50 relative overflow-y-auto ${direction === 'ar-fr' ? 'text-left font-sans' : 'text-right font-serif'}`} dir={direction === 'ar-fr' ? 'ltr' : 'rtl'}>
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-blue-500 opacity-50">
                  <i className="fa-solid fa-spinner fa-spin text-3xl"></i>
                  <span className="text-xs font-bold">جاري الصياغة القانونية...</span>
                </div>
              ) : translatedText ? (
                <div className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">{translatedText}</div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-300 italic text-xs">
                  بانتظار بدء الترجمة...
                </div>
              )}
            </div>
            {translatedText && !loading && (
              <button 
                onClick={copyToClipboard}
                className="absolute bottom-4 left-4 w-10 h-10 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 rounded-xl shadow-sm transition-all flex items-center justify-center"
                title="نسخ النص"
              >
                <i className="fa-solid fa-copy"></i>
              </button>
            )}
          </div>
        </div>

        <button 
          onClick={translate}
          disabled={loading || !sourceText}
          className="w-full mt-8 bg-blue-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-4 disabled:opacity-50"
        >
          <i className="fa-solid fa-wand-magic-sparkles"></i>
          {loading ? 'جاري المعالجة اللغوية...' : 'ترجمة النص وصياغته قانونياً'}
        </button>
      </div>
    </div>
  );
};

export default LegalTranslator;
