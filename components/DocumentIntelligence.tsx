
import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";

const DocumentIntelligence: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeDocument = async () => {
    if (!image) return;
    setLoading(true);
    setAnalysis(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Data = image.split(',')[1];
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          {
            inlineData: {
              data: base64Data,
              mimeType: 'image/jpeg'
            }
          },
          {
            text: `قم بتحليل هذه الوثيقة القانونية المغربية واستخرج المعلومات التالية بتنسيق نصي منظم:
            1. نوع الوثيقة (مثال: محضر، حكم، استدعاء، مقال).
            2. الأطراف المذكورة.
            3. رقم الملف القضائي (إن وجد).
            4. التاريخ الهام المذكور.
            5. ملخص قصير جداً للمحتوى.
            6. اقتراح لمهمة (Task) يجب القيام بها بناءً على هذه الوثيقة.
            تحدث باللغة العربية بأسلوب قانوني.`
          }
        ]
      });

      setAnalysis(response.text || 'لم يتمكن الذكاء الاصطناعي من تحليل الوثيقة بشكل دقيق.');
    } catch (error) {
      console.error(error);
      setAnalysis('حدث خطأ أثناء تحليل الصورة. يرجى التأكد من وضوح الصورة وصلاحية مفتاح API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 text-right" dir="rtl">
      <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100">
        <header className="flex items-center gap-5 mb-10">
          <div className="w-16 h-16 bg-cyan-600 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-3">
            <i className="fa-solid fa-eye text-2xl"></i>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-800">ذكاء الوثائق والأرشفة الذكية</h3>
            <p className="text-[10px] text-cyan-600 font-bold uppercase tracking-widest mt-1">تحليل الوثائق المصورة وتحويلها إلى بيانات رقمية</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Upload Area */}
          <div className="space-y-6">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-4 border-dashed rounded-[2.5rem] p-12 flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden min-h-[400px] ${image ? 'border-cyan-500 bg-cyan-50/10' : 'border-slate-100 bg-slate-50 hover:border-cyan-300'}`}
            >
              {image ? (
                <img src={image} alt="Document preview" className="absolute inset-0 w-full h-full object-contain p-4" />
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <i className="fa-solid fa-cloud-arrow-up text-3xl text-cyan-500"></i>
                  </div>
                  <div>
                    <p className="font-black text-slate-700">اضغط هنا لرفع صورة الوثيقة</p>
                    <p className="text-xs text-slate-400 font-bold">يدعم صور (JPG, PNG) من الكاميرا أو الهاتف</p>
                  </div>
                </div>
              )}
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
            </div>

            <div className="flex gap-4">
              <button 
                onClick={analyzeDocument}
                disabled={loading || !image}
                className="flex-1 bg-cyan-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-cyan-700 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
              >
                {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-wand-sparkles"></i>}
                {loading ? 'جاري تحليل الوثيقة...' : 'بدء التحليل الذكي (OCR)'}
              </button>
              {image && (
                <button 
                  onClick={() => {setImage(null); setAnalysis(null);}}
                  className="px-6 bg-slate-100 text-slate-500 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all"
                >
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              )}
            </div>
          </div>

          {/* Results Area */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <h4 className="font-black text-cyan-400 text-xs uppercase tracking-[0.2em] mb-8 flex items-center gap-2 relative z-10">
              <i className="fa-solid fa-robot"></i>
              نتائج استخراج البيانات
            </h4>

            {analysis ? (
              <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
                <div className="prose prose-invert max-w-none whitespace-pre-wrap text-sm leading-relaxed font-medium text-slate-300">
                  {analysis}
                </div>
                <div className="mt-10 pt-8 border-t border-white/10 flex gap-4">
                   <button className="flex-1 bg-white/10 hover:bg-white/20 py-3 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2">
                      <i className="fa-solid fa-folder-plus text-cyan-400"></i>
                      إنشاء ملف قضائي
                   </button>
                   <button className="flex-1 bg-white/10 hover:bg-white/20 py-3 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2">
                      <i className="fa-solid fa-calendar-plus text-amber-400"></i>
                      إضافة كجلب مهمة
                   </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30 space-y-4">
                <i className="fa-solid fa-microchip text-6xl"></i>
                <p className="font-bold text-sm">بانتظار رفع وتحليل الوثيقة...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: 'fa-file-shield', title: 'حماية الخصوصية', desc: 'يتم معالجة الصور لحظياً دون تخزينها بشكل دائم.' },
          { icon: 'fa-bolt', title: 'سرعة فائقة', desc: 'استخراج البيانات القانونية في ثوانٍ معدودة.' },
          { icon: 'fa-database', title: 'تكامل مباشر', desc: 'إمكانية تحويل النتائج إلى مهام أو ملفات بضغطة واحدة.' }
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 flex items-start gap-4">
             <div className="w-12 h-12 bg-cyan-50 text-cyan-600 rounded-xl flex items-center justify-center shrink-0">
                <i className={`fa-solid ${item.icon} text-xl`}></i>
             </div>
             <div>
                <h4 className="font-black text-slate-800 text-sm mb-1">{item.title}</h4>
                <p className="text-[10px] text-slate-400 font-bold leading-relaxed">{item.desc}</p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentIntelligence;
