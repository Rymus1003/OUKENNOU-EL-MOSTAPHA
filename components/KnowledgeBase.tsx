
import React from 'react';

const KnowledgeBase: React.FC = () => {
  const codes = [
    { title: 'مدونة الأسرة', id: 'moudawana', color: 'bg-pink-500', icon: 'fa-people-roof', link: 'http://adala.justice.gov.ma/production/html/ar/162061.htm' },
    { title: 'المسطرة المدنية', id: 'cpc', color: 'bg-blue-500', icon: 'fa-scale-balanced', link: 'http://adala.justice.gov.ma/production/html/ar/146194.htm' },
    { title: 'القانون الجنائي', id: 'cp', color: 'bg-rose-600', icon: 'fa-handcuffs', link: 'http://adala.justice.gov.ma/production/html/ar/164344.htm' },
    { title: 'الالتزامات والعقود', id: 'doc', color: 'bg-emerald-600', icon: 'fa-file-signature', link: 'http://adala.justice.gov.ma/production/html/ar/146033.htm' },
    { title: 'مدونة التجارة', id: 'com', color: 'bg-indigo-600', icon: 'fa-briefcase', link: 'http://adala.justice.gov.ma/production/html/ar/160359.htm' },
    { title: 'مدونة الشغل', id: 'labor', color: 'bg-cyan-600', icon: 'fa-user-gear', link: 'http://adala.justice.gov.ma/production/html/ar/160338.htm' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 text-right" dir="rtl">
      <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500 rounded-full blur-[100px]"></div>
        </div>

        <header className="mb-16 relative z-10">
           <h2 className="text-4xl font-black text-slate-900 mb-2">موسوعة القوانين المغربية</h2>
           <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">الوصول السريع للنصوص القانونية المحينة</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {codes.map((code, i) => (
            <a 
              key={i} 
              href={code.link} 
              target="_blank" 
              rel="noreferrer"
              className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100 hover:border-indigo-200 hover:bg-white hover:shadow-2xl transition-all group flex flex-col items-center text-center"
            >
              <div className={`w-20 h-20 ${code.color} rounded-[2rem] flex items-center justify-center text-white shadow-xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                <i className={`fa-solid ${code.icon} text-3xl`}></i>
              </div>
              <h4 className="text-xl font-black text-slate-800 mb-2">{code.title}</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">عرض النص الكامل (ADALA)</p>
              <div className="mt-6 w-10 h-1 bg-slate-200 rounded-full group-hover:w-20 group-hover:bg-indigo-500 transition-all"></div>
            </a>
          ))}
        </div>

        <div className="mt-20 bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden">
           <div className="absolute right-0 bottom-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mb-16"></div>
           <div className="flex flex-col md:flex-row justify-between items-center gap-10">
              <div className="space-y-4">
                 <h3 className="text-2xl font-black">الجريدة الرسمية للمملكة</h3>
                 <p className="text-slate-400 text-sm max-w-lg leading-relaxed">تحقق من آخر التعديلات المنشورة في الجريدة الرسمية الصادرة عن الأمانة العامة للحكومة لضمان العمل بآخر المستجدات التشريعية.</p>
              </div>
              <a href="http://www.sgg.gov.ma/arabe/BulletinOfficiel.aspx" target="_blank" rel="noreferrer" className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-black text-sm shadow-xl hover:bg-indigo-50 transition-all flex items-center gap-3">
                 <i className="fa-solid fa-external-link-alt text-indigo-600"></i>
                 دخول بوابة الجريدة الرسمية
              </a>
           </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;
