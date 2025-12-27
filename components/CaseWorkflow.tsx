
import React, { useState } from 'react';

const CaseWorkflow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: 'إعداد الملف', desc: 'جمع الوثائق، صياغة المقال، وتحديد المحكمة المختصة.', icon: 'fa-file-signature', color: 'bg-indigo-500' },
    { title: 'وضع المقال', desc: 'إيداع المقال بصندوق المحكمة وأداء الرسوم القضائية.', icon: 'fa-stamp', color: 'bg-blue-500' },
    { title: 'التبليغ', desc: 'استدعاء الأطراف عبر المفوض القضائي أو البريد المضمون.', icon: 'fa-envelope-open-text', color: 'bg-amber-500' },
    { title: 'تبادل المذكرات', desc: 'جلسات المرافعة، تقديم التعقيبات، والخبرة إن وجدت.', icon: 'fa-comments-legal', color: 'bg-purple-500' },
    { title: 'المداولة والحكم', desc: 'حجز القضية للمداولة والنطق بالحكم النهائي.', icon: 'fa-gavel', color: 'bg-emerald-500' },
    { title: 'التنفيذ', desc: 'تبليغ الحكم، استصدار الصيغة التنفيذية، وإجراءات الحجز.', icon: 'fa-hand-holding-dollar', color: 'bg-rose-500' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 text-right" dir="rtl">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
        <header className="flex items-center gap-5 mb-16">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-3">
            <i className="fa-solid fa-diagram-project text-2xl"></i>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-800">متتبع المسطرة القضائية المغربية</h3>
            <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest mt-1">تصوير مراحل سير الدعوى من الافتتاح إلى التنفيذ</p>
          </div>
        </header>

        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 hidden lg:block"></div>
          <div 
            className="absolute top-1/2 right-0 h-1 bg-indigo-600 -translate-y-1/2 transition-all duration-700 hidden lg:block"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          ></div>

          <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 relative z-10">
            {steps.map((step, i) => (
              <div 
                key={i} 
                onClick={() => setCurrentStep(i)}
                className={`cursor-pointer group flex lg:flex-col items-center gap-5 lg:gap-8 transition-all ${i <= currentStep ? 'opacity-100' : 'opacity-40 hover:opacity-60'}`}
              >
                <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center text-white shadow-2xl transition-all transform group-hover:scale-110 ${i <= currentStep ? step.color : 'bg-slate-300'} ${i === currentStep ? 'ring-8 ring-indigo-50' : ''}`}>
                  <i className={`fa-solid ${step.icon} text-3xl`}></i>
                </div>
                <div className="lg:text-center">
                  <h4 className={`font-black text-sm mb-2 ${i === currentStep ? 'text-indigo-600' : 'text-slate-800'}`}>{step.title}</h4>
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed max-w-[150px] hidden lg:block">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 p-10 bg-slate-50 rounded-[3rem] border border-slate-100 relative overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
           <div className="flex flex-col md:flex-row gap-10 items-start relative z-10">
              <div className={`w-24 h-24 ${steps[currentStep].color} rounded-3xl flex items-center justify-center text-white text-4xl shadow-xl shrink-0`}>
                 <i className={`fa-solid ${steps[currentStep].icon}`}></i>
              </div>
              <div className="space-y-4">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">المرحلة الحالية: {currentStep + 1} من {steps.length}</span>
                 <h3 className="text-3xl font-black text-slate-800">{steps[currentStep].title}</h3>
                 <p className="text-slate-600 text-lg leading-relaxed font-medium">{steps[currentStep].desc}</p>
                 <div className="pt-6 flex gap-4">
                    <button className="px-8 py-3 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-700 hover:bg-slate-100 transition-all shadow-sm">عرض المساطر المرتبطة</button>
                    <button className="px-8 py-3 bg-indigo-600 text-white rounded-xl text-xs font-black shadow-lg hover:bg-indigo-700 transition-all">تحميل النماذج الجاهزة</button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CaseWorkflow;
