
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { api } from '../api';

const LaborMediationTool: React.FC = () => {
  const [disputeInfo, setDisputeInfo] = useState('');
  const [strategy, setStrategy] = useState('');
  const [loading, setLoading] = useState(false);

  const generateStrategy = async () => {
    if (!disputeInfo) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        أنت محامٍ مغربي متخصص في القضاء الاجتماعي (نزاعات الشغل).
        أريد التحضير لـ "محاولة صلح" (Conciliation) في نزاع شغل.
        معطيات النزاع: "${disputeInfo}"
        
        المطلوب:
        1. تقديم استراتيجية تفاوضية (الحد الأدنى والحد الأقصى للتعويض).
        2. ذكر المواد القانونية من مدونة الشغل التي تدعم موقف الموكل (سواء كان أجيراً أو مشغلاً).
        3. اقتراح صياغة لـ "محضر صلح" ينهي النزاع بصفة نهائية وناجزة.
        4. نصيحة حول كيفية تجنب المسطرة القضائية الطويلة إذا كان الصلح ممكناً.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });

      const content = response.text || 'فشل في توليد الاستراتيجية.';
      setStrategy(content);

      await api.saveDraft({
        title: `استراتيجية صلح: ${disputeInfo.substring(0, 30)}...`,
        content: content,
        type: 'Mediation'
      });
    } catch (error) {
      setStrategy('خطأ في معالجة طلب الوساطة.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-right" dir="rtl">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden relative">
        <header className="flex items-center gap-5 mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-3">
            <i className="fa-solid fa-handshake-simple text-2xl"></i>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-800">مخطط وساطة نزاعات الشغل</h3>
            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mt-1">التحضير لجلسات الصلح والوساطة الاتفاقية</p>
          </div>
        </header>

        <div className="space-y-6">
          <label className="block text-xs font-black text-slate-400 mb-2 pr-2">ملخص النزاع العمالي (الأقدمية، الراتب، سبب التوقف...)</label>
          <textarea 
            className="w-full h-40 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] p-8 text-sm font-medium focus:ring-4 focus:ring-blue-50 outline-none transition-all resize-none shadow-inner"
            placeholder="مثال: أجير طرد بعد 10 سنوات عمل، راتبه 5000 درهم، يتهم المشغل بالطرد التعسفي..."
            value={disputeInfo}
            onChange={e => setDisputeInfo(e.target.value)}
          ></textarea>

          <button 
            onClick={generateStrategy}
            disabled={loading || !disputeInfo}
            className="w-full bg-blue-700 text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-800 shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-4"
          >
            {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-comments-dollar"></i>}
            {loading ? 'جاري رسم خطة التفاوض...' : 'توليد استراتيجية الصلح والتعويض'}
          </button>
        </div>

        {strategy && (
          <div className="mt-12 p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100 animate-in fade-in slide-in-from-bottom-5 duration-700 relative">
             <div className="absolute top-0 right-0 w-2 h-full bg-blue-500"></div>
             <div className="flex justify-between items-center mb-6 border-b border-blue-200 pb-4">
                <h4 className="font-black text-slate-800 m-0 text-sm">مذكرة الوساطة المقترحة:</h4>
                <button onClick={() => {navigator.clipboard.writeText(strategy); alert('تم النسخ');}} className="text-blue-600 hover:scale-110 transition-transform"><i className="fa-solid fa-copy"></i></button>
             </div>
             <div className="prose prose-blue max-w-none whitespace-pre-wrap text-sm leading-loose font-medium text-slate-700">
                {strategy}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LaborMediationTool;
