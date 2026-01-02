
import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import ClientForm from './components/ClientForm';
import ClientList from './components/ClientList';
import CaseForm from './components/CaseForm';
import CaseList from './components/CaseList';
import HearingForm from './components/HearingForm';
import HearingList from './components/HearingList';
import CaseTracking from './components/CaseTracking';
import CaseDetails from './components/CaseDetails';
import Tasks from './components/Tasks';
import Settings from './components/Settings';
import Reports from './components/Reports';
import DocumentArchive from './components/DocumentArchive';
import MailManager from './components/MailManager';
import ExecutionTracker from './components/ExecutionTracker';
import StaffManager from './components/StaffManager';
import AppointmentManager from './components/AppointmentManager';
import DataManagement from './components/DataManagement';
import FinanceHub from './components/FinanceHub';
import GlobalCommandCenter from './components/GlobalCommandCenter';
import TaxCalculator from './components/TaxCalculator';
import LaborCalculator from './components/LaborCalculator';
import IndemnityCalculator from './components/IndemnityCalculator';
import AlimonyCalculator from './components/AlimonyCalculator';
import KnowledgeBase from './components/KnowledgeBase';

type View = 
  | 'dashboard' | 'clients-list' | 'clients-add' | 'clients-edit' 
  | 'dossiers-list' | 'dossiers-add' | 'dossier-details' 
  | 'hearings-list' | 'hearings-add' | 'case-tracking' 
  | 'finance'
  | 'tasks' | 'staff' | 'appointments' 
  | 'archive' | 'mails' | 'executions'
  | 'reports' | 'tools' | 'settings' | 'data';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedDossierId, setSelectedDossierId] = useState<string | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigateToWithDossier = (view: any, dossierId: string) => {
    setSelectedDossierId(dossierId);
    setCurrentView(view as View);
  };

  const navigateToWithClient = (view: View, clientId: string) => {
    setSelectedClientId(clientId);
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50" dir="rtl">
      <GlobalCommandCenter 
        isOpen={isCommandOpen} 
        onClose={() => setIsCommandOpen(false)} 
        onNavigate={(view, id) => id ? (view === 'clients-edit' ? navigateToWithClient(view, id) : navigateToWithDossier(view, id)) : setCurrentView(view as View)}
      />

      <nav className="w-full md:w-64 bg-slate-900 text-white p-4 shadow-xl border-l border-slate-800 flex flex-col fixed md:h-full z-20 overflow-y-auto custom-scrollbar no-print">
        <div className="text-center mb-8 border-b border-slate-700 pb-4 shrink-0">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-lg transform rotate-3">
             <i className="fa-solid fa-scale-balanced text-3xl"></i>
          </div>
          <h1 className="text-xl font-bold tracking-tight">المحامي برو</h1>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-bold">Gestion de Cabinet</p>
        </div>
        
        <ul className="space-y-1 flex-1">
          <NavItem active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} icon="fa-house-chimney" label="الرئيسية" />
          
          <MenuSection label="إدارة القضايا" />
          <NavItem active={currentView === 'clients-list'} onClick={() => setCurrentView('clients-list')} icon="fa-users" label="الموكلين" />
          <NavItem active={currentView === 'dossiers-list'} onClick={() => setCurrentView('dossiers-list')} icon="fa-folder-tree" label="ملفات القضايا" />
          <NavItem active={currentView === 'case-tracking'} onClick={() => setCurrentView('case-tracking')} icon="fa-arrow-up-right-dots" label="تتبع وضعية الملفات" />
          
          <MenuSection label="الأجندة والمواعيد" />
          <NavItem active={currentView === 'hearings-list'} onClick={() => setCurrentView('hearings-list')} icon="fa-calendar-check" label="جدول الجلسات" />
          <NavItem active={currentView === 'appointments'} onClick={() => setCurrentView('appointments')} icon="fa-clock" label="المواعيد" />
          <NavItem active={currentView === 'tasks'} onClick={() => setCurrentView('tasks')} icon="fa-list-check" label="المهام والمحررين" />

          <MenuSection label="المحاسبة والمالية" />
          <NavItem active={currentView === 'finance'} onClick={() => setCurrentView('finance')} icon="fa-wallet" label="المالية والمحاسبة" />

          <MenuSection label="التنفيذ والأرشيف" />
          <NavItem active={currentView === 'executions'} onClick={() => setCurrentView('executions')} icon="fa-gavel" label="ملفات التنفيذ" />
          <NavItem active={currentView === 'archive'} onClick={() => setCurrentView('archive')} icon="fa-box-archive" label="أرشيف المستندات" />
          <NavItem active={currentView === 'mails'} onClick={() => setCurrentView('mails')}} icon="fa-envelopes-bulk" label="البريد والمراسلات" />

          <MenuSection label="أدوات وتقارير" />
          <NavItem active={currentView === 'tools'} onClick={() => setCurrentView('tools')} icon="fa-toolbox" label="حاسبات قانونية" />
          <NavItem active={currentView === 'reports'} onClick={() => setCurrentView('reports')} icon="fa-file-pdf" label="التقارير الإدارية" />
          
          <div className="mt-8 pt-4 border-t border-slate-700">
            <NavItem active={currentView === 'settings'} onClick={() => setCurrentView('settings')} icon="fa-gear" label="إعدادات المكتب" />
            <NavItem active={currentView === 'data'} onClick={() => setCurrentView('data')} icon="fa-database" label="النسخ الاحتياطي" />
          </div>
        </ul>
      </nav>

      <main className="flex-1 p-4 md:p-8 md:mr-64 overflow-auto min-h-screen">
        <header className="mb-8 flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm no-print">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl">
                <i className={`fa-solid ${getViewIcon(currentView)}`}></i>
             </div>
             <div>
                <h2 className="text-2xl font-black text-slate-800">{getViewTitle(currentView)}</h2>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{new Date().toLocaleDateString('ar-MA', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
             </div>
          </div>
          <button onClick={() => setIsCommandOpen(true)} className="bg-slate-50 text-slate-400 px-4 py-2 rounded-xl text-xs font-bold border border-slate-100 hover:bg-slate-100 transition-all flex items-center gap-2">
            <i className="fa-solid fa-magnifying-glass"></i>
            بحث سريع (Ctrl+K)
          </button>
        </header>

        <div className="animate-in fade-in zoom-in-95 duration-500 pb-20">
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'clients-list' && (
            <ClientList 
              onEditClient={(id) => navigateToWithClient('clients-edit', id)} 
              onAddClient={() => setCurrentView('clients-add')}
            />
          )}
          {currentView === 'clients-add' && <ClientForm />}
          {currentView === 'clients-edit' && <ClientForm initialClientId={selectedClientId} />}
          {currentView === 'dossiers-list' && <CaseList onQuickAction={navigateToWithDossier} />}
          {currentView === 'dossiers-add' && <CaseForm />}
          {currentView === 'dossier-details' && selectedDossierId && <CaseDetails dossierId={selectedDossierId} onBack={() => setCurrentView('dossiers-list')} />}
          {currentView === 'case-tracking' && <CaseTracking onAddHearing={(id) => navigateToWithDossier('hearings-add', id)} />}
          {currentView === 'hearings-list' && <HearingList />}
          {currentView === 'hearings-add' && <HearingForm initialDossierId={selectedDossierId} />}
          {currentView === 'appointments' && <AppointmentManager />}
          {currentView === 'tasks' && <Tasks />}
          {currentView === 'staff' && <StaffManager />}
          {currentView === 'finance' && <FinanceHub initialDossierId={selectedDossierId} />}
          {currentView === 'executions' && <ExecutionTracker />}
          {currentView === 'archive' && <DocumentArchive initialDossierId={selectedDossierId} />}
          {currentView === 'mails' && <MailManager />}
          {currentView === 'reports' && <Reports />}
          {currentView === 'tools' && <LawCalculators />}
          {currentView === 'settings' && <Settings />}
          {currentView === 'data' && <DataManagement />}
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ active, onClick, icon, label }: any) => (
  <li>
    <button onClick={onClick} className={`w-full text-right px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${active ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}>
      <i className={`fa-solid ${icon} w-5 text-center`}></i>
      <span className="font-medium text-sm">{label}</span>
    </button>
  </li>
);

const MenuSection = ({ label }: { label: string }) => (
  <div className="py-2 px-4 text-[9px] font-black text-slate-500 uppercase tracking-widest mt-4 border-r-2 border-slate-700">{label}</div>
);

const LawCalculators = () => (
  <div className="space-y-12">
    <TaxCalculator />
    <LaborCalculator />
    <IndemnityCalculator />
    <AlimonyCalculator />
    <KnowledgeBase />
  </div>
);

const getViewTitle = (view: View) => {
  switch(view) {
    case 'dashboard': return 'نظرة عامة على المكتب';
    case 'clients-list': return 'قاعدة بيانات الموكلين';
    case 'dossiers-list': return 'جرد الملفات القضائية';
    case 'case-tracking': return 'تتبع وضعية الملفات (Suivi)';
    case 'finance': return 'المركز المالي والمحاسبة';
    case 'hearings-list': return 'أجندة الجلسات';
    case 'tasks': return 'إدارة المهام وفريق العمل';
    case 'executions': return 'ملفات التنفيذ والمزايدات';
    case 'tools': return 'أدوات الحساب القانوني';
    default: return 'إدارة المكتب الرقمي';
  }
};

const getViewIcon = (view: View) => {
  switch(view) {
    case 'dashboard': return 'fa-chart-pie';
    case 'clients-list': return 'fa-users';
    case 'case-tracking': return 'fa-arrow-up-right-dots';
    case 'finance': return 'fa-wallet';
    case 'hearings-list': return 'fa-calendar-days';
    case 'tools': return 'fa-calculator';
    default: return 'fa-folder';
  }
};

export default App;
