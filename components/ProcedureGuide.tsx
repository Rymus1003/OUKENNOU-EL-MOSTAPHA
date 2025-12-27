import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

interface Step {
  title: string;
  description: string;
}

const ProcedureGuide: React.FC = () => {
  const [procedureName, setProcedureName] = useState('');
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(false);

  const getProcedureSteps = async () => {
    if (!procedureName) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `قم بتوليد قائمة بخطوات المسطرة القانونية التالية في المغرب: ${procedureName}. أريد النتيجة كقائمة مرتبة من الخطوات الإجرائية (مثلاً: وضع المقال، التبليغ، الجلسة، الحكم، التنفيذ).`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              steps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING }
                  },
                  required: ['title', 'description']
                }
              }
            },
            required: ['steps']
          }
        }
      });

      const data = JSON.parse(response.text || '{"steps":[]}');
      setSteps(data.steps);
    } catch (error) {
      console.error(error);
      alert('فشل جلب الدليل الإجرائي.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-right" dir="rtl">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <i className="fa-solid fa-route text-2xl"></i>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800">مساعد المساطر الإجرائية</h3>
            <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest">تخطيط المسار القانوني للملف</p>
          </div>
        </div>

        <div className="flex gap-4">
          <input 
            type="text" 
            className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-indigo-50 outline-none"
            placeholder="مثال: دعوى الطلاق للشقاق، مسطرة الحجز التحفظي..."
            value={procedureName}
            onChange={(e) => setProcedureName(e.target.value)}
          />
          <button 
            onClick={getProcedureSteps}
            disabled={loading || !procedureName}
            className="bg-slate-900 text-white px-8 rounded-2xl font-black hover:bg-black transition-all flex items-center gap-2"
          >
            {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
            تحليل المسطرة
          </button>
        </div>

        {steps.length > 0 && (
          <div className="mt-12 space-y-8 relative">
            <div className="absolute right-[19px] top-0 bottom-0 w-1 bg-slate-100 rounded-full"></div>
            {steps.map((step, idx) => (
              <div key={idx} className="relative pr-12 group animate-in slide-in-from-right-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="absolute right-0 top-0 w-10 h-10 bg-white border-4 border-indigo-600 rounded-full flex items-center justify-center font-black text-indigo-600 shadow-sm z-10 group-hover:scale-110 transition-transform">
                  {idx + 1}
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all">
                  <h4 className="font-black text-slate-800 text-lg mb-2">{step.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcedureGuide;