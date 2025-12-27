
import React, { useState, useEffect } from 'react';

interface ApiKeyGuardProps {
  children: React.ReactNode;
}

const ApiKeyGuard: React.FC<ApiKeyGuardProps> = ({ children }) => {
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  useEffect(() => {
    checkKey();
  }, []);

  const checkKey = async () => {
    // @ts-ignore
    const selected = await window.aistudio.hasSelectedApiKey();
    setHasKey(selected);
  };

  const handleOpenSelectKey = async () => {
    // @ts-ignore
    await window.aistudio.openSelectKey();
    // نفترض النجاح بناءً على توجيهات النظام لتجنب حالة السباق
    setHasKey(true);
  };

  if (hasKey === null) return <div className="p-10 text-center font-bold text-slate-400">جاري التحقق من الإعدادات...</div>;

  if (!hasKey) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 p-8 text-center">
        <div className="max-w-md space-y-6">
          <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <i className="fa-solid fa-key text-3xl"></i>
          </div>
          <h3 className="text-2xl font-black text-slate-800">تفعيل ميزات الذكاء الاصطناعي</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            لاستخدام المساعد القانوني وتوليد المذكرات آلياً، يجب عليك تحديد مفتاح API الخاص بك. يرجى اختيار مشروع مدفوع (Paid Project) من منصة Google Cloud.
          </p>
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-amber-700 text-xs text-right leading-relaxed">
            <i className="fa-solid fa-circle-info ml-2"></i>
            يجب التأكد من تفعيل الفوترة (Billing) في حسابك. لمزيد من المعلومات:
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="block mt-1 font-bold underline">ai.google.dev/gemini-api/docs/billing</a>
          </div>
          <button 
            onClick={handleOpenSelectKey}
            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-plus-circle"></i>
            اختيار مفتاح API للبدء
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ApiKeyGuard;
