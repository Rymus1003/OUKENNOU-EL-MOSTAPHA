
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { api } from '../api';

const AuctionSpecialist: React.FC = () => {
  const [assetType, setAssetType] = useState('real_estate');
  const [assetDetails, setAssetDetails] = useState('');
  const [openingBid, setOpeningBid] = useState('');
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);

  const generateAuctionRequest = async () => {
    if (!assetDetails) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        أنت محامٍ مغربي خبير في مساطر التنفيذ والبيوع القضائية.
        المطلوب: صياغة "طلب من أجل فتح مسطرة البيع بالمزاد العلني" لـ ${assetType === 'real_estate' ? 'عقار محفظ' : 'منقولات محجوزة'}.
        
        المعطيات:
        - بيانات المحجوز: "${assetDetails}"
        - الثمن الافتتاحي المقترح: ${openingBid} درهم.
        
        المتطلبات (الالتزام بمقتضيات قانون المسطرة المدنية):
        1. الإشارة إلى محضر الحجز التنفيذي والسند التنفيذي.
        2. المطالبة بتعيين خبير لتقييم العقار (إذا لم يحدد الثمن) أو اعتماد الثمن الافتتاحي.
        3. المطالبة بتحديد تاريخ جلسة المزايدة وإجراءات الإشهار (الجرائد، التعليق باللوحة الإعلانية للمحكمة).
        4. ذكر مقتضيات الفصول 469 وما يليها (للعقارات) أو 462 وما يليها (للمنقولات).
        
        اللغة: عربية قانونية صارمة.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });

      const content = response.text || 'فشل في توليد طلب المزاد.';
      setDraft(content);

      await api.saveDraft({
        title: `طلب بيع بالمزاد: ${assetDetails.substring(0, 20)}`,
        content: content,
        type: 'Execution'
      });
    } catch (error) {
      setDraft('حدث خطأ أثناء معالجة مسطرة المزاد.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-right" dir="rtl">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-50/50 via-transparent to-transparent pointer-events-none"></div>
        
        <header className="flex items-center gap-5 mb-10 relative z-10">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-2">
            <i className="fa-solid fa-gavel text-2xl text-amber-500"></i>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-800">مساعد البيوع القضائية</h3>
            <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest mt-1">تسيير إجراءات البيع بالمزاد العلني واستخلاص الديون</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 relative z-10">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">نوع المال المحجوز</label>
              <select 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-3 font-bold focus:ring-4 focus:ring-amber-50 outline-none"
                value={assetType}
                onChange={e => setAssetType(e.target.value)}
              >
                <option value="real_estate">عقار (أرض / شقة / فيلا)</option>
                <option value="movable">منقولات (سيارات / آلات / أثاث)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">الثمن الافتتاحي المقترح (د.م)</label>
              <input 
                type="number" 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-3 font-bold focus:ring-4 focus:ring-amber-50 outline-none"
                placeholder="0.00"
                value={openingBid}
                onChange={e => setOpeningBid(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">تفاصيل المحجوز والسند التنفيذي</label>
            <textarea 
              className="w-full h-[140px] bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 text-sm font-bold focus:ring-4 focus:ring-amber-50 outline-none resize-none shadow-inner"
              placeholder="مثال: العقار ذي الرسم عدد...، بناءً على الحكم النهائي عدد... الصادر بتاريخ..."
              value={assetDetails}
              onChange={e => setAssetDetails(e.target.value)}
            ></textarea>
          </div>
        </div>

        <button 
          onClick={generateAuctionRequest}
          disabled={loading || !assetDetails}
          className="w-full bg-amber-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-amber-700 shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-4 relative z-10"
        >
          {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-bullhorn"></i>}
          {loading ? 'جاري إعداد إجراءات المزايدة...' : 'توليد طلب فتح المزاد العلني'}
        </button>

        {draft && (
          <div className="mt-12 p-8 bg-slate-900 text-amber-50 rounded-[2.5rem] border border-amber-900/50 animate-in fade-in slide-in-from-bottom-5 duration-700">
             <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                <h4 className="font-black m-0 text-sm">مسودة طلب المزاد القضائي:</h4>
                <div className="flex gap-2">
                   <button onClick={() => {navigator.clipboard.writeText(draft); alert('تم النسخ');}} className="text-amber-400 hover:text-white transition-colors"><i className="fa-solid fa-copy"></i></button>
                   <button onClick={() => window.print()} className="text-slate-400 hover:text-white transition-colors"><i className="fa-solid fa-print"></i></button>
                </div>
             </div>
             <div className="prose prose-invert max-w-none whitespace-pre-wrap text-sm leading-loose font-medium opacity-90 font-serif">
                {draft}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuctionSpecialist;
