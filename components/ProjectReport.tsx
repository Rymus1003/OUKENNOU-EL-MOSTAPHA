
import React from 'react';

const ProjectReport: React.FC = () => {
  const features = [
    { title: 'إدارة الموكلين والقضايا', desc: 'نظام CRUD كامل مع تتبع الحالة وربط البيانات.', icon: 'fa-users-gear', color: 'bg-indigo-500' },
    { title: 'المساعد القانوني الذكي (Gemini)', desc: 'تحليل الاستشارات وصياغة المذكرات بالذكاء الاصطناعي.', icon: 'fa-wand-magic-sparkles', color: 'bg-purple-500' },
    { title: 'ذكاء الوثائق (OCR)', desc: 'استخراج البيانات تلقائياً من صور المحاضر والأحكام.', icon: 'fa-eye', color: 'bg-cyan-500' },
    { title: 'المحاسبة والوضعية المالية', desc: 'تتبع الأتعاب، التحصيل، الضريبة (TVA)، وحساب الرسوم القضائية.', icon: 'fa-coins', color: 'bg-rose-500' },
    { title: 'غرفة الاستراتيجية الصوتية', desc: 'جلسات عصف ذهني صوتية لتحضير المرافعات (Live API).', icon: 'fa-microphone-lines', color: 'bg-indigo-700' },
    { title: 'الخريطة القضائية المغربية', desc: 'تحديد مواقع المحاكم وجهات اتصالها عبر Google Maps.', icon: 'fa-map-location-dot', color: 'bg-emerald-500' },
    { title: 'مستكشف الاجتهاد والتشريع', desc: 'بحث مباشر في قرارات محكمة النقض والجريدة الرسمية.', icon: 'fa-gavel', color: 'bg-slate-700' },
    { title: 'المترجم القانوني المتخصص', desc: 'ترجمة فورية (AR-FR) مع الحفاظ على المصطلحات المغربية.', icon: 'fa-language', color: 'bg-blue-600' },
    { title: 'حاسبة الآجال والتعويضات', desc: 'أدوات دقيقة لحساب آجال الطعون وتعويضات حوادث السير.', icon: 'fa-calculator', color: 'bg-rose-700' },
  ];

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 text-right p-8" dir="rtl">
      <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50 rounded-full blur-[100px] -mr-48 -mt-48 opacity-40"></div>
        
        <header className="text-center mb-16 relative z-10">
          <div className="w-24 h-24 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white shadow-2xl mx-auto mb-6 rotate-6 transform hover:rotate-0 transition-transform">
            <i className="fa-solid fa-file-invoice text-4xl"></i>
          </div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tight mb-4">تقرير الإنجاز النهائي للمشروع</h2>
          <p className="text-indigo-600 text-lg font-bold uppercase tracking-[0.2em]">AvocatManager Pro - Digital Transformation</p>
          <div className="h-1.5 w-32 bg-indigo-500 mx-auto mt-8 rounded-full"></div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {features.map((f, i) => (
            <div key={i} className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 hover:border-indigo-200 transition-all group">
              <div className={`w-14 h-14 ${f.color} rounded-2xl flex items-center justify-center text-white shadow-lg mb-6 group-hover:scale-110 transition-transform`}>
                <i className={`fa-solid ${f.icon} text-2xl`}></i>
              </div>
              <h4 className="text-lg font-black text-slate-800 mb-3">{f.title}</h4>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">{f.desc}</p>
            </div>
          ))}
        </section>

        <section className="mt-20 bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
           <div className="flex flex-col md:flex-row justify-between items-center gap-10 relative z-10">
              <div className="max-w-xl">
                 <h3 className="text-3xl font-black mb-6">الخلاصة التقنية</h3>
                 <p className="text-slate-400 leading-relaxed font-medium italic">
                    تم بناء هذا النظام ليكون الحل الرقمي المتكامل للمحامي المغربي، مدمجاً بين الإدارة التقليدية للملفات وقدرات الذكاء الاصطناعي التوليدي لرفع كفاءة العمل القانوني، مع الالتزام التام بالخصوصية المهنية والتشريعات الوطنية المعمول بها.
                 </p>
              </div>
              <button 
                onClick={handlePrintReport}
                className="bg-white text-slate-900 px-10 py-5 rounded-2xl font-black shadow-2xl hover:bg-indigo-50 transition-all flex items-center gap-4 shrink-0"
              >
                <i className="fa-solid fa-print text-xl text-indigo-600"></i>
                طباعة التقرير الكامل
              </button>
           </div>
        </section>

        <footer className="mt-16 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-t border-slate-50 pt-10">
          تم التطوير بواسطة: Senior Frontend Engineer • 2024 • جميع الحقوق محفوظة
        </footer>
      </div>
    </div>
  );
};

export default ProjectReport;
