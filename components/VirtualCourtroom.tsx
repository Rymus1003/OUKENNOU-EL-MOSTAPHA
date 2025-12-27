
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const VirtualCourtroom: React.FC = () => {
  const [argument, setArgument] = useState('');
  const [interaction, setInteraction] = useState<{ role: 'judge' | 'lawyer', text: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const startInteraction = async () => {
    if (!argument) return;
    setLoading(true);
    const newInteraction = [...interaction, { role: 'lawyer' as const, text: argument }];
    setInteraction(newInteraction);
    setArgument('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        أنت الآن "رئيس هيئة المحكمة" في محكمة مغربية. أنت قاضٍ صارم، خبير، وتدقق في كل التفاصيل.
        قام المحامي بعرض الحجة التالية عليك: "${argument}"
        
        سياق المحادثة السابقة: ${interaction.map(i => `${i.role}: ${i.text}`).join('\n')}
        
        المطلوب منك:
        1. تقمص دور القاضي والرد بوقار (مثال: السيد الدفاع، المحكمة تلاحظ أن...).
        2. طرح سؤال قانوني محرج أو طلب توضيح حول فصل معين (مثل قانون الالتزامات والعقود أو المسطرة المدنية).
        3. تحدي المحامي في نقطة ضعف في حجته.
        
        تحدث باللغة العربية الفصحى الرصينة وبنبرة قضائية.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });

      setInteraction([...newInteraction, { role: 'judge', text: response.text || 'تفضل بمتابعة مرافعتك.' }]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-right" dir="rtl">
      <div className="bg-slate-900 rounded-[3rem] p-10 shadow-2xl border border-slate-800 relative overflow-hidden flex flex-col min-h-[700px]">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none"></div>
        
        <header className="flex items-center gap-6 mb-12 relative z-10">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-white border border-slate-700 shadow-xl">
            <i className="fa-solid fa-gavel text-2xl text-amber-500"></i>
          </div>
          <div>
            <h3 className="text-3xl font-black text-white">قاعة المحاكاة القضائية</h3>
            <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest mt-1">اختبر مرافعتك أمام القاضي الذكي</p>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto space-y-6 mb-8 px-4 custom-scrollbar relative z-10">
          {interaction.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-20 text-white space-y-4">
               <i className="fa-solid fa-scale-balanced text-7xl"></i>
               <p className="font-black text-lg">المحكمة في استماع... ابدأ بعرض دفعك أو مرافعتك</p>
            </div>
          ) : (
            interaction.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'lawyer' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] p-6 rounded-3xl text-sm leading-relaxed font-medium shadow-sm ${msg.role === 'lawyer' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'}`}>
                   <div className="flex items-center gap-2 mb-2 opacity-50 text-[10px] font-black uppercase">
                      <i className={`fa-solid ${msg.role === 'lawyer' ? 'fa-user-tie' : 'fa-user-shield text-amber-500'}`}></i>
                      {msg.role === 'lawyer' ? 'الأستاذ الدفاع' : 'السيد رئيس الجلسة'}
                   </div>
                   {msg.text}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-end animate-pulse">
               <div className="bg-slate-800 p-4 rounded-2xl text-xs text-slate-400 font-black">السيد الرئيس يداول في حجتك...</div>
            </div>
          )}
        </div>

        <div className="relative z-10 flex gap-4 bg-slate-800/50 p-4 rounded-[2rem] border border-slate-700">
          <textarea 
            className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder:text-slate-500 resize-none h-12 py-3"
            placeholder="أدخل مرافعتك أو ردك على سؤال القاضي..."
            value={argument}
            onChange={e => setArgument(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), startInteraction())}
          ></textarea>
          <button 
            onClick={startInteraction}
            disabled={loading || !argument}
            className="w-12 h-12 bg-amber-500 text-slate-900 rounded-2xl flex items-center justify-center hover:bg-amber-400 transition-all shadow-lg active:scale-95 disabled:opacity-30"
          >
            <i className="fa-solid fa-paper-plane-top"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VirtualCourtroom;
