
import React, { useRef } from 'react';

const DataManagement: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data: any = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('avocat_pro_') || key.startsWith('office_') || key.startsWith('evidence_'))) {
        data[key] = localStorage.getItem(key);
      }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_cabinet_avocat_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (confirm('تنبيه: استيراد البيانات سيقوم بتعويض البيانات الحالية. هل أنت متأكد؟')) {
          Object.keys(data).forEach(key => {
            localStorage.setItem(key, data[key]);
          });
          alert('تم استيراد بيانات المكتب بنجاح. سيتم إعادة تحميل التطبيق.');
          window.location.reload();
        }
      } catch (err) {
        alert('خطأ في صيغة ملف النسخ الاحتياطي.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-right" dir="rtl">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
        <header className="flex items-center gap-5 mb-12">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-3">
            <i className="fa-solid fa-database text-2xl text-emerald-400"></i>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-800">إدارة وسلامة البيانات</h3>
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-1">تأمين المكتب عبر النسخ الاحتياطي الدوري</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-emerald-50 p-8 rounded-[2.5rem] border border-emerald-100 flex flex-col justify-between group hover:shadow-xl transition-all">
              <div>
                 <i className="fa-solid fa-cloud-arrow-down text-4xl text-emerald-600 mb-6 group-hover:bounce transition-all"></i>
                 <h4 className="text-xl font-black text-emerald-900 mb-2">تصدير قاعدة البيانات</h4>
                 <p className="text-xs text-emerald-700 font-medium leading-relaxed">قم بتحميل نسخة كاملة من جميع ملفات الموكلين، المواعيد، والأتعاب في ملف واحد آمن.</p>
              </div>
              <button 
                onClick={handleExport}
                className="mt-8 bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-3"
              >
                <i className="fa-solid fa-download"></i>
                تحميل النسخة الاحتياطية
              </button>
           </div>

           <div className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100 flex flex-col justify-between group hover:shadow-xl transition-all">
              <div>
                 <i className="fa-solid fa-file-import text-4xl text-indigo-600 mb-6 transition-all"></i>
                 <h4 className="text-xl font-black text-indigo-900 mb-2">استيراد البيانات</h4>
                 <p className="text-xs text-indigo-700 font-medium leading-relaxed">قم باستعادة بيانات مكتبك من ملف تم تصديره مسبقاً في حالة تغيير الجهاز أو التحديث.</p>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleImport} className="hidden" accept=".json" />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="mt-8 bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-3"
              >
                <i className="fa-solid fa-upload"></i>
                اختيار ملف الاستعادة
              </button>
           </div>
        </div>

        <div className="mt-12 bg-slate-900 p-8 rounded-[2.5rem] text-white">
           <div className="flex items-start gap-4">
              <i className="fa-solid fa-circle-exclamation text-amber-400 text-2xl mt-1"></i>
              <div>
                 <h5 className="font-black text-amber-400 mb-2">نصيحة أمنية هامة</h5>
                 <p className="text-xs font-medium leading-relaxed opacity-70 italic">
                    ينصح بشدة بتصدير نسخة احتياطية من بياناتك مرة واحدة على الأقل أسبوعياً وتخزينها في وحدة تخزين خارجية مشفرة. هذا الإجراء يضمن استمرارية العمل في حال حدوث عطل تقني غير متوقع.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DataManagement;
