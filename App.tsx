
import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import ClientForm from './components/ClientForm';
import ClientList from './components/ClientList';
import CaseForm from './components/CaseForm';
import CaseList from './components/CaseList';
import FeesForm from './components/FeesForm';
import HearingForm from './components/HearingForm';
import HearingList from './components/HearingList';
import CaseTracking from './components/CaseTracking';
import { api } from './api';

type View = 'dashboard' | 'clients-add' | 'clients-list' | 'dossiers-add' | 'dossiers-list' | 'fees' | 'hearings-add' | 'hearings-list' | 'case-tracking';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [selectedDossierId, setSelectedDossierId] = useState<string | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      const status = await api.checkConnection();
      setIsOnline(status);
    };
    checkStatus();
    const interval = setInterval(checkStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const navigateToWithDossier = (view: View, dossierId: string) => {
    setSelectedDossierId(dossierId);
    setCurrentView(view);
  };

  const handleMenuClick = (view: View) => {
    setSelectedDossierId(null); 
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50" dir="rtl">
      {/* Sidebar */}
      <nav className="w-full md:w-64 bg-slate-900 text-white p-4 shadow-xl border-l border-slate-800 flex flex-col fixed md:h-full z-20">
        <div className="text-center mb-8 border-b border-slate-700 pb-4">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-lg transform rotate-3">
             <i className="fa-solid fa-scale-balanced text-3xl"></i>
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            المحامي برو
          </h1>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-bold">Cabinet d'Avocat Digital</p>
        </div>
        
        <ul className="space-y-1 flex-1 overflow-y-auto">
          <li>
            <button 
              onClick={() => handleMenuClick('dashboard')}
              className={`w-full text-right px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-200 ${currentView === 'dashboard' ? 'bg-indigo-600 shadow-md translate-x-[-4px]' : 'hover:bg-slate-800 text-slate-400'}`}
            >
              <i className="fa-solid fa-house-chimney w-5"></i>
              <span className="font-medium">الرئيسية</span>
            </button>
          </li>
          
          <div className="py-2 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">الموكلين</div>
          <li>
            <button 
              onClick={() => handleMenuClick('clients-list')}
              className={`w-full text-right px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-200 ${currentView === 'clients-list' ? 'bg-indigo-600 shadow-md translate-x-[-4px]' : 'hover:bg-slate-800 text-slate-400'}`}
            >
              <i className="fa-solid fa-users-line w-5"></i>
              <span className="font-medium">قائمة الموكلين</span>
            </button>
          </li>

          <div className="py-2 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">إدارة القضايا</div>
          <li>
            <button 
              onClick={() => handleMenuClick('case-tracking')}
              className={`w-full text-right px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-200 ${currentView === 'case-tracking' ? 'bg-indigo-600 shadow-md translate-x-[-4px]' : 'hover:bg-slate-800 text-slate-400'}`}
            >
              <i className="fa-solid fa-magnifying-glass-chart w-5 text-emerald-400"></i>
              <span className="font-medium">تتبع الملفات والجلسات</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => handleMenuClick('dossiers-list')}
              className={`w-full text-right px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-200 ${currentView === 'dossiers-list' ? 'bg-indigo-600 shadow-md translate-x-[-4px]' : 'hover:bg-slate-800 text-slate-400'}`}
            >
              <i className="fa-solid fa-rectangle-list w-5"></i>
              <span className="font-medium">لائحة القضايا</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => handleMenuClick('hearings-list')}
              className={`w-full text-right px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-200 ${currentView === 'hearings-list' ? 'bg-indigo-600 shadow-md translate-x-[-4px]' : 'hover:bg-slate-800 text-slate-400'}`}
            >
              <i className="fa-solid fa-calendar-days w-5"></i>
              <span className="font-medium">أجندة الجلسات</span>
            </button>
          </li>

          <div className="py-2 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">إضافة بيانات</div>
          <li>
            <button 
              onClick={() => handleMenuClick('clients-add')}
              className={`w-full text-right px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-200 ${currentView === 'clients-add' ? 'bg-indigo-600 shadow-md translate-x-[-4px]' : 'hover:bg-slate-800 text-slate-400'}`}
            >
              <i className="fa-solid fa-user-plus w-5"></i>
              <span className="font-medium">إضافة موكل</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => handleMenuClick('dossiers-add')}
              className={`w-full text-right px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-200 ${currentView === 'dossiers-add' ? 'bg-indigo-600 shadow-md translate-x-[-4px]' : 'hover:bg-slate-800 text-slate-400'}`}
            >
              <i className="fa-solid fa-folder-plus w-5"></i>
              <span className="font-medium">فتح ملف جديد</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => handleMenuClick('hearings-add')}
              className={`w-full text-right px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-200 ${currentView === 'hearings-add' ? 'bg-indigo-600 shadow-md translate-x-[-4px]' : 'hover:bg-slate-800 text-slate-400'}`}
            >
              <i className="fa-solid fa-gavel w-5"></i>
              <span className="font-medium">جدولة جلسة</span>
            </button>
          </li>

          <div className="py-2 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">المالية</div>
          <li>
            <button 
              onClick={() => handleMenuClick('fees')}
              className={`w-full text-right px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-200 ${currentView === 'fees' ? 'bg-indigo-600 shadow-md translate-x-[-4px]' : 'hover:bg-slate-800 text-slate-400'}`}
            >
              <i className="fa-solid fa-wallet w-5"></i>
              <span className="font-medium">الأتعاب</span>
            </button>
          </li>
        </ul>

        <div className="mt-auto bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
          <p className="text-[10px] text-slate-500 mb-2">روابط سريعة</p>
          <a href="https://www.mahakim.ma" target="_blank" className="text-xs text-indigo-400 hover:underline flex items-center gap-2">
            <i className="fa-solid fa-arrow-up-right-from-square"></i>
            بوابة محاكم
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-8 md:mr-64 overflow-auto">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              {currentView === 'dashboard' && 'نظرة عامة'}
              {currentView === 'case-tracking' && 'تتبع الملفات والجلسات المترابطة'}
              {currentView === 'clients-list' && 'قاعدة بيانات الموكلين'}
              {currentView === 'clients-add' && 'تسجيل موكل جديد'}
              {currentView === 'dossiers-list' && 'إدارة القضايا'}
              {currentView === 'hearings-list' && 'أجندة الجلسات'}
              {currentView === 'dossiers-add' && 'فتح ملف جديد'}
              {currentView === 'hearings-add' && 'جدولة جلسة'}
              {currentView === 'fees' && 'المحاسبة'}
            </h2>
            <p className="text-slate-500 text-sm mt-1">{new Date().toLocaleDateString('ar-MA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          
          <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
             <div className="text-left px-3 border-l ml-3">
               <p className="text-xs font-bold text-slate-800">الأستاذ(ة) المحامي</p>
               <div className="flex items-center gap-1 mt-1">
                 <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`}></span>
                 <p className={`text-[9px] font-bold uppercase ${isOnline ? 'text-emerald-500' : 'text-rose-500'}`}>
                   {isOnline ? 'متصل' : 'Offline'}
                 </p>
               </div>
             </div>
             <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 border border-slate-200">
               <i className="fa-solid fa-user-tie"></i>
             </div>
          </div>
        </header>

        <div className="animate-in fade-in duration-500">
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'case-tracking' && <CaseTracking onAddHearing={(id) => navigateToWithDossier('hearings-add', id)} />}
          {currentView === 'clients-list' && <ClientList />}
          {currentView === 'clients-add' && <ClientForm />}
          {currentView === 'dossiers-list' && <CaseList onQuickAction={navigateToWithDossier} />}
          {currentView === 'hearings-list' && <HearingList />}
          {currentView === 'dossiers-add' && <CaseForm />}
          {currentView === 'hearings-add' && <HearingForm initialDossierId={selectedDossierId} />}
          {currentView === 'fees' && <FeesForm initialDossierId={selectedDossierId} />}
        </div>
      </main>
    </div>
  );
};

export default App;
