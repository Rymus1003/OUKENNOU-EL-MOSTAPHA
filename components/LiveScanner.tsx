
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

const LiveScanner: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
      setActive(true);
    } catch (err) {
      alert("يرجى تفعيل صلاحية الكاميرا للمسح الضوئي.");
    }
  };

  const stopCamera = () => {
    if (stream) stream.getTracks().forEach(t => t.stop());
    setStream(null);
    setActive(false);
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setLoading(true);
    
    const context = canvasRef.current.getContext('2d');
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context?.drawImage(videoRef.current, 0, 0);
    
    const base64Image = canvasRef.current.toDataURL('image/jpeg').split(',')[1];
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: [
          {
            inlineData: {
              data: base64Image,
              mimeType: 'image/jpeg'
            }
          },
          {
            text: "قم بمسح هذه الوثيقة القانونية المغربية. استخرج: 1. رقم الملف (Numéro de dossier). 2. اسم المحكمة. 3. الأطراف. 4. تاريخ الجلسة القادمة إن وجد. 5. نوع الإجراء. قدم النتيجة بنقاط واضحة باللغة العربية."
          }
        ]
      });

      setAnalysis(response.text || 'لم يتم العثور على بيانات واضحة.');
    } catch (error) {
      setAnalysis('حدث خطأ أثناء التحليل الذكي للصورة.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-right" dir="rtl">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden relative">
        <header className="flex items-center gap-5 mb-10">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-2">
            <i className="fa-solid fa-camera-retro text-2xl text-cyan-400"></i>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-800">الماسح الضوئي الذكي</h3>
            <p className="text-[10px] text-cyan-600 font-bold uppercase tracking-widest mt-1">تحويل الأوراق إلى بيانات رقمية عبر الكاميرا</p>
          </div>
        </header>

        {!active ? (
          <div className="bg-slate-50 border-4 border-dashed border-slate-200 rounded-[2.5rem] p-20 text-center space-y-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
               <i className="fa-solid fa-video text-4xl text-slate-300"></i>
            </div>
            <p className="text-slate-500 font-bold">استخدم كاميرا الجهاز لمسح الأحكام والمحاضر فورياً</p>
            <button onClick={startCamera} className="bg-cyan-600 text-white px-10 py-4 rounded-2xl font-black shadow-lg hover:bg-cyan-700 transition-all flex items-center gap-3 mx-auto">
              <i className="fa-solid fa-power-off"></i>
              تفعيل الكاميرا
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative rounded-[2.5rem] overflow-hidden border-8 border-slate-900 shadow-2xl bg-black aspect-video">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <div className="absolute inset-0 border-2 border-cyan-400/30 pointer-events-none flex items-center justify-center">
                 <div className="w-64 h-80 border-2 border-cyan-400 rounded-lg animate-pulse"></div>
              </div>
              <button onClick={stopCamera} className="absolute top-4 right-4 bg-rose-600 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg"><i className="fa-solid fa-xmark"></i></button>
            </div>

            <button 
              onClick={captureAndAnalyze}
              disabled={loading}
              className="w-full bg-cyan-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-cyan-700 shadow-xl transition-all flex items-center justify-center gap-4"
            >
              {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-expand"></i>}
              {loading ? 'جاري التحليل القانوني...' : 'التقاط الصورة وتحليل الوثيقة'}
            </button>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />

        {analysis && (
          <div className="mt-12 p-8 bg-slate-900 text-cyan-50 rounded-[2.5rem] border border-cyan-900/50 animate-in slide-in-from-bottom-5 duration-700">
             <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                <i className="fa-solid fa-robot text-cyan-400"></i>
                <h4 className="font-black m-0 text-sm">البيانات المستخرجة (AI Scan):</h4>
             </div>
             <div className="prose prose-invert max-w-none whitespace-pre-wrap text-sm leading-loose font-medium opacity-90">
                {analysis}
             </div>
             <div className="mt-8 pt-6 border-t border-white/5 flex gap-3">
                <button className="bg-white/10 px-6 py-2 rounded-xl text-[10px] font-black hover:bg-white/20 transition-all">فتح ملف جديد بهذا الرقم</button>
                <button className="bg-white/10 px-6 py-2 rounded-xl text-[10px] font-black hover:bg-white/20 transition-all">إضافة لجلسات الملف</button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveScanner;
