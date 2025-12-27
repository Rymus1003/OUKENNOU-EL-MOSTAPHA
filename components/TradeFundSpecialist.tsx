
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { api } from '../api';

const TradeFundSpecialist: React.FC = () => {
  const [opType, setOpType] = useState('sale');
  const [details, setDetails] = useState('');
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);

  const generateTradeFundDoc = async () => {
    if (!details) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const types: Record<string, string> = {
        'sale': 'عقد بيع أصل تجاري (Cession de fonds de commerce)',
        'lease_management': 'عقد تسيير حر (Gérance libre)',
        'pledge': 'رهن الأصل التجاري (Nantissement)',
      };

      const prompt = `
        بصفتك محامياً مغربياً خبيراً في القانون التجاري (القانون 15-95).
        المطلوب: صياغة مسودة قانونية لـ "${types[opType]}".
        
        المعطيات:
        - البيانات الأساسية (الأطراف، الموقع، النشاط): "${details}"
        
        المتطلبات القانونية (الالتزام بمدونة التجارة):
        1. التنصيص على العناصر المعنوية والمادية المشمولة بالعملية.
        2. الإشارة إلى إجراءات الشهر والإشعار (الجريدة الرسمية وجريدة الإعلانات القانونية).
        3. ذكر مقتضيات المادة 83 وما يليها بخصوص حقوق الدائنين والتعرضات.
        4. في حالة البيع: ذكر ثمن العناصر المادية والمعنوية بشكل منفصل.
        5. الصياغة بلغة قانونية عربية رصينة صالحة للتسجيل في السجل التجاري.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });

      const content = response.text || 'فشل في توليد المسودة التجارية.';
      setDraft(content);

      await api.saveDraft({
        title: `${types[opType]} - ${new Date().toLocaleDateString('ar-MA')}`,
        content: content,
        type: 'Commercial'
      });
    } catch (error) {
      setDraft('حدث خطأ أثناء معالجة العملية التجارية.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-right" dir="rtl">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden relative">
        <header className="flex items-center gap-5 mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-2">
            <i className="fa-solid fa-shop text-2xl"></i>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-800">مساعد الأصل التجاري</h3>
            <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest mt-1">إدارة عمليات البيع، الرهن، والتسيير الحر (القانون 15-95)</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <label className="block text-[10px] font-black text-slate-400 uppercase pr-2">نوع العملية التجارية</label>
            <div className="flex flex-col gap-3">
              {[
                { id: 'sale', label: 'بيع أصل تجاري' },
                { id: 'lease_management', label: 'تسيير حر' },
                { id: 'pledge', label: 'رهن الحساب التجاري' }
              ].map(t => (
                <button 
                  key={t.id}
                  onClick={() => setOpType(t.id)}
                  className={`text-right px-6 py-4 rounded-2xl text-xs font-black transition-all border-2 ${opType === t.id ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white text-slate-500 border-slate-50 hover:border-indigo-100'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <label className="block text-[10px] font-black text-slate-400 uppercase pr-2">تفاصيل العملية (الأطراف، السجل التجاري، الثمن...)</label>
            <textarea 
              className="w-full h-48 bg-slate-50 border-2 border-slate-100 rounded-[2rem] p-6 text-sm font-medium focus:ring-4 focus:ring-indigo-50 outline-none transition-all resize-none shadow-inner"
              placeholder="أدخل أسماء الأطراف ورقم السجل التجاري وموقع الأصل التجاري..."
              value={details}
              onChange={e => setDetails(e.target.value)}
            ></textarea>
          </div>
        </div>

        <button 
          onClick={generateTradeFundDoc}
          disabled={loading || !details}
          className="w-full bg-indigo-900 text-white py-5 rounded-2xl font-black text-xl hover:bg-black shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-4"
        >
          {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-file-signature text-indigo-400"></i>}
          {loading ? 'جاري صياغة العقد التجاري...' : 'توليد مسودة المحرر التجاري'}
        </button>

        {draft && (
          <div className="mt-12 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-200 animate-in fade-in slide-in-from-bottom-5 duration-700">
             <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h4 className="font-black text-slate-800 m-0 text-sm">المسودة القانونية المقترحة:</h4>
                <button onClick={() => {navigator.clipboard.writeText(draft); alert('تم النسخ');}} className="text-indigo-600 hover:scale-110 transition-transform"><i className="fa-solid fa-copy"></i></button>
             </div>
             <div className="prose prose-indigo max-w-none whitespace-pre-wrap text-sm leading-loose font-medium text-slate-700">
                {draft}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradeFundSpecialist;
