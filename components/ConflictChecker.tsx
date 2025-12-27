
import React, { useState } from 'react';
import { api } from '../api';
import { GoogleGenAI } from "@google/genai";

const ConflictChecker: React.FC = () => {
  const [partyName, setPartyName] = useState('');
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const checkConflict = async () => {
    if (!partyName) return;
    setLoading(true);
    setAnalysis('');
    try {
      const [clients, dossiers] = await Promise.all([api.getClients(), api.getDossiers()]);
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        أنا محامٍ مغربي وأريد التحقق من وجود "تضارب مصالح" (Conflict of Interest) قبل قبول موكل جديد.
        الطرف الجديد المراد التحقق منه: ${partyName}
        
        قاعدة بياناتي الحالية تحتوي على:
        - الموكلين: ${clients.map(c => c.nom_complet).join(', ')}
        - الأطراف الخصم في القضايا الجارية: ${dossiers.map(d => d.partie_adverse).join(', ')}
        - مواضيع القضايا: ${dossiers.map(d => d.titre_affaire).join(', ')}
        
        بناءً على أخلاقيات مهنة المحاماة في المغرب، هل هناك احتمال لتضارب المصالح؟ 
        يرجى البحث عن الأسماء المتشابهة، الشركات التابعة، أو القضايا التي قد يكون فيها هذا الطرف خصماً سابقاً أو حالياً.
        قدم النتيجة بوضوح (آمن / خطر / مريب) مع التعليل.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setAnalysis(response.text || 'لم يتم العثور على تضارب واضح.');
    } catch (error) {
      console.error(error);
      setAnalysis('حدث خطأ أثناء فحص التضارب الذكي.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-right" dir="rtl">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-50 rounded-full blur-3xl -mr-24 -mt-24"></div>
        
        <header className="flex items-center gap-5 mb-10 relative z-10">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-2">
            <i className="fa-solid fa-shield-halved text-2xl text-amber-400"></i>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-800">نظام فحص تضارب المصالح</h3>
            <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest mt-1">تأمين النزاهة المهنية قبل قبول القضايا</p>
          </div>
        </header>

        <div className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pr-2">اسم الطرف المراد فحصه (شخص أو شركة)</label>
            <input 
              type="text" 
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-lg font-black focus:ring-4 focus:ring-amber-50 outline-none transition-all"
              placeholder="أدخل الاسم الكامل هنا..."
              value={partyName}
              onChange={(e) => setPartyName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && checkConflict()}
            />
          </div>

          <button 
            onClick={checkConflict}
            disabled={loading || !partyName}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xl hover:bg-black shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-4"
          >
            {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-user-shield"></i>}
            {loading ? 'جاري التحليل الأخلاقي...' : 'بدء الفحص الذكي'}
          </button>
        </div>

        {analysis && (
          <div className="mt-12 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-200 animate-in fade-in slide-in-from-bottom-5 duration-700">
             <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
                <i className="fa-solid fa-brain text-amber-500"></i>
                <h4 className="font-black text-slate-800 m-0">تقرير النزاهة المهنية:</h4>
             </div>
             <div className="prose prose-slate max-w-none whitespace-pre-wrap text-sm leading-relaxed font-medium text-slate-700">
                {analysis}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConflictChecker;
