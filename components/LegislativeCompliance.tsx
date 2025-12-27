
import React from 'react';

const LegislativeCompliance: React.FC = () => {
  const sections = [
    {
      title: "الامتثال الضريبي (TVA 10%)",
      desc: "تمت برمجة النظام ليعتمد تلقائياً نسبة 10% كضريبة على القيمة المضافة للأتعاب، تماشياً مع المادة 121 من المدونة العامة للضرائب المغربية المتعلقة بالمهن الحرة القانونية.",
      icon: "fa-percent"
    },
    {
      title: "قانون المسطرة المدنية والجنائية",
      desc: "تعتمد حاسبة الآجال على القواعد الواردة في الفصول 134 و441 من ق.م.م، مع مراعاة أيام العطل والأيام الكاملة (Jours Francs).",
      icon: "fa-scale-balanced"
    },
    {
      title: "حماية المعطيات الشخصية (CNDP)",
      desc: "التطبيق مصمم للعمل محلياً (On-Premise) أو عبر تشفير نهاية لنهاية (E2EE) لضمان خصوصية بيانات الموكلين وفق القانون 08-09 المتعلق بحماية الأشخاص الذاتيين تجاه معالجة المعطيات ذات الطابع الشخصي.",
      icon: "fa-shield-halved"
    },
    {
      title: "قانون الالتزامات والعقود (D.O.C)",
      desc: "وحدة تحليل العقود مبرمجة للكشف عن البنود التعسفية بناءً على القوة الملزمة للعقد والمبادئ العامة للقانون المدني المغربي.",
      icon: "fa-file-contract"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 text-right p-4" dir="rtl">
      <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-indigo-50/50 via-transparent to-transparent pointer-events-none"></div>
        
        <header className="flex flex-col md:flex-row justify-between items-start mb-16 relative z-10 gap-8">
          <div className="space-y-4">
             <div className="w-20 h-20 bg-indigo-900 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl">
                <i className="fa-solid fa-file-shield text-3xl"></i>
             </div>
             <h2 className="text-5xl font-black text-slate-900 tracking-tight">تقرير الامتثال والتحليل التشريعي</h2>
             <p className="text-slate-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                مذكرة تقنية حول ملاءمة البرنامج للقانون المغربي
             </p>
          </div>
          <button onClick={() => window.print()} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs hover:bg-indigo-700 transition-all flex items-center gap-3 shadow-xl">
             <i className="fa-solid fa-print"></i>
             طباعة التقرير القانوني الكامل
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          {sections.map((s, i) => (
            <div key={i} className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 hover:border-indigo-200 transition-all group">
               <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm mb-6 group-hover:scale-110 transition-transform">
                  <i className={`fa-solid ${s.icon} text-xl`}></i>
               </div>
               <h4 className="text-xl font-black text-slate-800 mb-3">{s.title}</h4>
               <p className="text-sm text-slate-500 leading-relaxed font-medium">{s.desc}</p>
            </div>
          ))}
        </div>

        <section className="mt-20 p-10 bg-slate-900 rounded-[3rem] text-white relative overflow-hidden">
           <div className="absolute right-0 bottom-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] -mr-32 -mb-32"></div>
           <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
              <i className="fa-solid fa-laptop-code text-indigo-400"></i>
              الخلاصة الفنية (Technical Summary)
           </h3>
           <div className="space-y-6 text-slate-300 text-sm leading-relaxed font-medium italic">
              <p>تم بناء AvocatManager Pro كمنصة متكاملة تجمع بين إدارة البيانات العلائقية (Relational Database) وقدرات الذكاء الاصطناعي التوليدي (LLMs) لتوفير تجربة مستخدم رائدة في قطاع العدالة بالمغرب.</p>
              <ul className="list-disc pr-5 space-y-2 text-xs">
                <li>هيكلة البيانات: MySQL مع دعم كامل للترميز العربي (UTF-8 MB4).</li>
                <li>المحرك الذكي: Google Gemini 3 Pro لتحليل المذكرات واستنباط الأحكام.</li>
                <li>الخصوصية: بروتوكول تواصل مشفر SSL/TLS مع تخزين محلي لوسائل الإثبات الحساسة.</li>
              </ul>
           </div>
        </section>

        <footer className="mt-20 pt-10 border-t border-slate-50 text-center">
           <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">AvocatManager Pro Legislative Engine • Verified 2024</p>
        </footer>
      </div>
    </div>
  );
};

export default LegislativeCompliance;
