
import React from 'react';

const Dashboard: React.FC = () => {
  const stats = [
    { label: 'الملفات النشطة', value: '42', icon: 'fa-folder-open', color: 'bg-indigo-500', trend: '+3 هذا الأسبوع' },
    { label: 'جلسات اليوم', value: '5', icon: 'fa-calendar-check', color: 'bg-orange-500', trend: 'تبدأ على الساعة 09:00' },
    { label: 'إجمالي الموكلين', value: '128', icon: 'fa-user-tie', color: 'bg-emerald-500', trend: '2 موكلين جدد' },
    { label: 'مستحقات معلقة', value: '12,500 د.م', icon: 'fa-hand-holding-dollar', color: 'bg-rose-500', trend: '4 ملفات بانتظار الدفع' },
  ];

  return (
    <div className="space-y-8 text-right" dir="rtl">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="w3-card-4 bg-white p-6 border-r-4 border-indigo-500 rounded-xl hover:shadow-xl transition-all group">
            <div className="flex items-start justify-between">
              <div className={`${stat.color} text-white p-4 rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform`}>
                <i className={`fa-solid ${stat.icon} text-2xl`}></i>
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-400 mb-1">{stat.label}</p>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">{stat.value}</h3>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-50">
              <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-md">
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Hearings - Detailed */}
        <div className="lg:col-span-2 w3-card-4 bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100">
          <header className="bg-slate-50 p-5 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-3 text-slate-800 m-0">
              <i className="fa-solid fa-gavel text-indigo-600"></i>
              جدول الجلسات القادمة (بوابة محاكم)
            </h3>
            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-bold flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              متزامن الآن
            </span>
          </header>
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-bold border-b border-slate-100">
                  <th className="p-4">رقم الملف الرسمي</th>
                  <th className="p-4">الموكل</th>
                  <th className="p-4">المحكمة / القاعة</th>
                  <th className="p-4">توقيت الجلسة</th>
                  <th className="p-4 text-center">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  { ref: '2024/1301/100', client: 'أحمد بناني', tribunal: 'ابتدائية الرباط', room: '7', time: 'اليوم، 10:30' },
                  { ref: '2023/1205/55', client: 'سارة العلمي', tribunal: 'زجرية الدار البيضاء', room: '12', time: 'غداً، 09:15' },
                  { ref: '2022/4401/12', client: 'شركة النور ش.م', tribunal: 'تجارية طنجة', room: '3', time: '25 ماي، 11:00' },
                ].map((item, i) => (
                  <tr key={i} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="p-4 font-mono font-bold text-indigo-600 text-sm">{item.ref}</td>
                    <td className="p-4 font-bold text-slate-700 text-sm">{item.client}</td>
                    <td className="p-4">
                      <div className="text-xs text-slate-600">{item.tribunal}</div>
                      <div className="text-[10px] text-slate-400">القاعة رقم {item.room}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-xs font-bold text-slate-800">{item.time}</div>
                    </td>
                    <td className="p-4 text-center">
                      <a href="https://www.mahakim.ma" target="_blank" className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all inline-block">
                        <i className="fa-solid fa-arrow-up-right-from-square"></i>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Intelligence & Notifications */}
        <div className="space-y-6">
          <div className="w3-card-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-md">
             <h3 className="font-bold mb-6 flex items-center gap-3 text-slate-800">
               <i className="fa-solid fa-bolt-lightning text-amber-500"></i>
               ذكاء النظام وتنبيهات محاكم
             </h3>
             <div className="space-y-4">
               <div className="flex gap-4 p-4 bg-amber-50/50 rounded-2xl border-r-4 border-amber-400">
                  <div className="text-amber-600 mt-1"><i className="fa-solid fa-triangle-exclamation"></i></div>
                  <div>
                    <p className="text-xs font-bold text-amber-900 mb-1">تحديث جلسة مطلوب</p>
                    <p className="text-[10px] text-amber-700 leading-relaxed">تم رصد حكم جديد في الملف 2023/15 عبر بوابة محاكم. يرجى مراجعة منطوق الحكم.</p>
                  </div>
               </div>
               
               <div className="flex gap-4 p-4 bg-blue-50/50 rounded-2xl border-r-4 border-blue-400">
                  <div className="text-blue-600 mt-1"><i className="fa-solid fa-circle-info"></i></div>
                  <div>
                    <p className="text-xs font-bold text-blue-900 mb-1">تذكير بالأتعاب</p>
                    <p className="text-[10px] text-blue-700 leading-relaxed">الموكل "محمد اليوسفي" لديه دفعة مستحقة غداً بقيمة 3,500 د.م.</p>
                  </div>
               </div>

               <div className="flex gap-4 p-4 bg-emerald-50/50 rounded-2xl border-r-4 border-emerald-400">
                  <div className="text-emerald-600 mt-1"><i className="fa-solid fa-check-double"></i></div>
                  <div>
                    <p className="text-xs font-bold text-emerald-900 mb-1">مزامنة ناجحة</p>
                    <p className="text-[10px] text-emerald-700 leading-relaxed">تمت مزامنة جميع مواعيد الجلسات للأسبوع القادم بنجاح.</p>
                  </div>
               </div>
             </div>
          </div>

          <div className="w3-card-4 bg-indigo-600 p-6 rounded-2xl shadow-xl shadow-indigo-100 text-white relative overflow-hidden">
             <div className="relative z-10">
                <h4 className="font-bold text-sm mb-2 opacity-90">رابط سريع للمحاكم</h4>
                <p className="text-xs opacity-75 mb-6 leading-relaxed">الولوج المباشر لفضاء المحامين وبوابة تتبع القضايا الرسمية.</p>
                <a href="https://www.mahakim.ma" target="_blank" className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold py-3 px-6 rounded-xl block text-center transition-all">
                   بوابة Mahakim.ma
                </a>
             </div>
             <i className="fa-solid fa-landmark absolute -bottom-4 -right-4 text-white/10 text-8xl transform rotate-12"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
