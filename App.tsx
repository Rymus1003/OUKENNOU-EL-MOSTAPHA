
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
import LegalAssistant from './components/LegalAssistant';
import LawLibrary from './components/LawLibrary';
import ProcedureGuide from './components/ProcedureGuide';
import DocumentGenerator from './components/DocumentGenerator';
import BordereauGenerator from './components/BordereauGenerator';
import CaseDetails from './components/CaseDetails';
import ApiKeyGuard from './components/ApiKeyGuard';
import Tasks from './components/Tasks';
import Settings from './components/Settings';
import Reports from './components/Reports';
import DocumentArchive from './components/DocumentArchive';
import MailManager from './components/MailManager';
import LegalDeadlineCalculator from './components/LegalDeadlineCalculator';
import ExecutionTracker from './components/ExecutionTracker';
import StaffManager from './components/StaffManager';
import StrategyRoom from './components/StrategyRoom';
import JurisprudenceExplorer from './components/JurisprudenceExplorer';
import LegalNews from './components/LegalNews';
import DocumentIntelligence from './components/DocumentIntelligence';
import ClientLedger from './components/ClientLedger';
import CourtExplorer from './components/CourtExplorer';
import TaxCalculator from './components/TaxCalculator';
import ConflictChecker from './components/ConflictChecker';
import VoiceNotes from './components/VoiceNotes';
import LegalTranslator from './components/LegalTranslator';
import EvidenceVault from './components/EvidenceVault';
import IndemnityCalculator from './components/IndemnityCalculator';
import ProjectReport from './components/ProjectReport';
import AlimonyCalculator from './components/AlimonyCalculator';
import InheritanceSim from './components/InheritanceSim';
import InvoiceManager from './components/InvoiceManager';
import CaseWorkflow from './components/CaseWorkflow';
import LaborCalculator from './components/LaborCalculator';
import AnalyticsReport from './components/AnalyticsReport';
import ContractAnalyzer from './components/ContractAnalyzer';
import AppointmentManager from './components/AppointmentManager';
import KnowledgeBase from './components/KnowledgeBase';
import AppealGroundsGenerator from './components/AppealGroundsGenerator';
import CriminalSentenceGuide from './components/CriminalSentenceGuide';
import GlobalCommandCenter from './components/GlobalCommandCenter';
import LiveScanner from './components/LiveScanner';
import DailyCourtList from './components/DailyCourtList';
import OfficeExpenses from './components/OfficeExpenses';
import LegislativeCompliance from './components/LegislativeCompliance';
import DataManagement from './components/DataManagement';
import SmartDraftingStudio from './components/SmartDraftingStudio';
import JudicialExpertiseAnalyzer from './components/JudicialExpertiseAnalyzer';
import RebuttalGenerator from './components/RebuttalGenerator';
import HearingSummaryGenerator from './components/HearingSummaryGenerator';
import InjunctionGenerator from './components/InjunctionGenerator';
import WitnessPrepTool from './components/WitnessPrepTool';
import DraftHistory from './components/DraftHistory';
import CassationDraftingStudio from './components/CassationDraftingStudio';
import LegalAdviceGenerator from './components/LegalAdviceGenerator';
import VirtualCourtroom from './components/VirtualCourtroom';
import ClientStatusReporter from './components/ClientStatusReporter';
import MorningBriefing from './components/MorningBriefing';
import AdminLitigationSpecialist from './components/AdminLitigationSpecialist';
import RealEstateSpecialist from './components/RealEstateSpecialist';
import CompanyFormationAssistant from './components/CompanyFormationAssistant';
import LaborMediationTool from './components/LaborMediationTool';
import ConstitutionalAssistant from './components/ConstitutionalAssistant';
import LegalAgreementBuilder from './components/LegalAgreementBuilder';
import PrecautionaryAttachmentStudio from './components/PrecautionaryAttachmentStudio';
import ArbitrationClauseBuilder from './components/ArbitrationClauseBuilder';
import TradeFundSpecialist from './components/TradeFundSpecialist';
import InsuranceClaimAssistant from './components/InsuranceClaimAssistant';
import ExequaturAssistant from './components/ExequaturAssistant';
import AuctionSpecialist from './components/AuctionSpecialist';
import FamilyLawSpecialist from './components/FamilyLawSpecialist';
import OfficialNoticeAssistant from './components/OfficialNoticeAssistant';
import { api } from './api';

type View = 
  | 'dashboard' | 'clients-add' | 'clients-list' | 'clients-edit' 
  | 'dossiers-add' | 'dossiers-list' | 'dossiers-edit' | 'dossier-details' 
  | 'fees' | 'hearings-add' | 'hearings-list' | 'case-tracking' 
  | 'legal-ai' | 'law-library' | 'procedure-guide' | 'docs' | 'bordereau' 
  | 'tasks' | 'settings' | 'reports' | 'archive' | 'mails' | 'deadlines' 
  | 'executions' | 'staff' | 'strategy-room' | 'jurisprudence' | 'news' 
  | 'doc-intelligence' | 'client-ledger' | 'court-map' | 'tax-calc' 
  | 'conflicts' | 'voice-notes' | 'translator' | 'evidence' | 'indemnity-calc' 
  | 'project-report' | 'alimony' | 'mirath' | 'invoices' | 'workflow' 
  | 'labor-calc' | 'analytics' | 'contract-ai' | 'appointments' | 'codes'
  | 'appeal-strategy' | 'criminal-sentences' | 'live-scan' | 'court-list' | 'expenses'
  | 'compliance' | 'data-mgr' | 'draft-studio' | 'expert-analyzer' | 'rebuttal' | 'hearing-report'
  | 'injunction' | 'witness-prep' | 'draft-history' | 'cassation' | 'legal-advice'
  | 'virtual-court' | 'status-report' | 'morning-brief' | 'admin-law' | 'real-estate'
  | 'company-formation' | 'labor-mediation' | 'constitutional' | 'agreement-builder'
  | 'attachment-studio' | 'arbitration' | 'trade-fund' | 'insurance-claim'
  | 'exequatur' | 'auction' | 'family-law' | 'official-notice';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [selectedDossierId, setSelectedDossierId] = useState<string | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      const status = await api.checkConnection();
      setIsOnline(status);
    };
    checkStatus();
    const interval = setInterval(checkStatus, 10000);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const navigateToWithDossier = (view: View, dossierId: string) => {
    setSelectedDossierId(dossierId);
    setCurrentView(view);
  };

  const navigateToWithClient = (view: View, clientId: string) => {
    setSelectedClientId(clientId);
    setCurrentView(view);
  };

  const handleMenuClick = (view: View) => {
    setSelectedDossierId(null); 
    setSelectedClientId(null);
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50" dir="rtl">
      {/* Search Palette */}
      <GlobalCommandCenter 
        isOpen={isCommandOpen} 
        onClose={() => setIsCommandOpen(false)} 
        onNavigate={(view, id) => id ? (view === 'clients-edit' ? navigateToWithClient(view, id) : navigateToWithDossier(view as View, id)) : handleMenuClick(view as View)}
      />

      {/* Sidebar */}
      <nav className="w-full md:w-64 bg-slate-900 text-white p-4 shadow-xl border-l border-slate-800 flex flex-col fixed md:h-full z-20 overflow-y-auto custom-scrollbar no-print">
        <div className="text-center mb-8 border-b border-slate-700 pb-4 shrink-0">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-lg transform rotate-3 transition-transform hover:rotate-0 cursor-pointer">
             <i className="fa-solid fa-scale-balanced text-3xl"></i>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">المحامي برو</h1>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-bold">Morocco Legal Suite</p>
        </div>
        
        <ul className="space-y-1 flex-1">
          <li>
            <button onClick={() => handleMenuClick('dashboard')} className={`w-full text-right px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${currentView === 'dashboard' ? 'bg-indigo-600 shadow-lg' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}>
              <i className="fa-solid fa-house-chimney w-5 text-center"></i>
              <span className="font-medium text-sm">الرئيسية</span>
            </button>
          </li>
          
          <div className="py-2 px-4 text-[9px] font-black text-slate-500 uppercase tracking-widest mt-4 border-r-2 border-pink-500/30">قضاء الأسرة</div>
          <li>
            <button onClick={() => handleMenuClick('family-law')} className={`w-full text-right px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${currentView === 'family-law' ? 'bg-pink-600 shadow-lg' : 'hover:bg-slate-800 text-pink-400 hover:text-white'}`}>
              <i className="fa-solid fa-people-roof w-5 text-center"></i>
              <span className="font-medium text-sm">مساعد قضايا الأسرة</span>
            </button>
          </li>

          <div className="py-2 px-4 text-[9px] font-black text-slate-500 uppercase tracking-widest mt-4 border-r-2 border-rose-500/30">التبليغ والإنذارات</div>
          <li>
            <button onClick={() => handleMenuClick('official-notice')} className={`w-full text-right px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${currentView === 'official-notice' ? 'bg-rose-600 shadow-lg' : 'hover:bg-slate-800 text-rose-400 hover:text-white'}`}>
              <i className="fa-solid fa-bullhorn w-5 text-center"></i>
              <span className="font-medium text-sm">منشئ الإنذارات</span>
            </button>
          </li>

          <div className="py-2 px-4 text-[9px] font-black text-slate-500 uppercase tracking-widest mt-4 border-r-2 border-emerald-500/30">التنفيذ والمزايدات</div>
          <li>
            <button onClick={() => handleMenuClick('auction')} className={`w-full text-right px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${currentView === 'auction' ? 'bg-amber-600 shadow-lg' : 'hover:bg-slate-800 text-amber-400 hover:text-white'}`}>
              <i className="fa-solid fa-gavel w-5 text-center"></i>
              <span className="font-medium text-sm">البيوع القضائية</span>
            </button>
          </li>
          <li>
            <button onClick={() => handleMenuClick('exequatur')} className={`w-full text-right px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${currentView === 'exequatur' ? 'bg-indigo-700 shadow-lg' : 'hover:bg-slate-800 text-indigo-400 hover:text-white'}`}>
              <i className="fa-solid fa-globe w-5 text-center"></i>
              <span className="font-medium text-sm">تذييل أحكام الخارج</span>
            </button>
          </li>

          <div className="py-2 px-4 text-[9px] font-black text-slate-500 uppercase tracking-widest mt-4 border-r-2 border-indigo-500/30">منازعات الأعمال</div>
          <li>
            <button onClick={() => handleMenuClick('trade-fund')} className={`w-full text-right px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${currentView === 'trade-fund' ? 'bg-indigo-700 shadow-lg' : 'hover:bg-slate-800 text-indigo-400 hover:text-white'}`}>
              <i className="fa-solid fa-shop w-5 text-center"></i>
              <span className="font-medium text-sm">الأصل التجاري</span>
            </button>
          </li>
          
          <div className="mt-auto pt-8 space-y-1">
            <li>
              <button onClick={() => handleMenuClick('draft-history')} className={`w-full text-right px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${currentView === 'draft-history' ? 'bg-slate-700 text-white shadow-lg' : 'hover:bg-slate-800 text-slate-500'}`}>
                <i className="fa-solid fa-clock-rotate-left w-5 text-center"></i>
                <span className="font-bold text-sm">سجل المسودات</span>
              </button>
            </li>
            <li>
              <button onClick={() => handleMenuClick('settings')} className={`w-full text-right px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${currentView === 'settings' ? 'bg-slate-700 text-white' : 'hover:bg-slate-800 text-slate-500'}`}>
                <i className="fa-solid fa-gear w-5 text-center"></i>
                <span className="font-medium text-sm">الإعدادات</span>
              </button>
            </li>
          </div>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 md:mr-64 overflow-auto min-h-screen">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/50 p-6 rounded-3xl border border-slate-200 backdrop-blur-sm shadow-sm no-print">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-indigo-600 text-xl">
                {currentView === 'dashboard' && <i className="fa-solid fa-chart-pie"></i>}
                {currentView === 'family-law' && <i className="fa-solid fa-people-roof text-pink-600"></i>}
                {currentView === 'official-notice' && <i className="fa-solid fa-bullhorn text-rose-600"></i>}
                {currentView === 'exequatur' && <i className="fa-solid fa-globe text-indigo-600"></i>}
                {currentView === 'auction' && <i className="fa-solid fa-gavel text-amber-600"></i>}
             </div>
             <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                  {currentView === 'dashboard' && 'نظرة عامة على المكتب'}
                  {currentView === 'family-law' && 'مساعد قضاء الأسرة'}
                  {currentView === 'official-notice' && 'مساعد التبليغ والإنذارات'}
                  {currentView === 'exequatur' && 'مساعد تذييل الأحكام الأجنبية'}
                  {currentView === 'auction' && 'مساعد البيوع القضائية'}
                </h2>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{new Date().toLocaleDateString('ar-MA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
             </div>
          </div>
          <div className="flex gap-3">
             <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 border ${isOnline ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`}></span>
                {isOnline ? 'متصل بالسيرفر' : 'وضع الأوفلاين'}
             </div>
          </div>
        </header>

        <div className="animate-in fade-in zoom-in-95 duration-500 pb-20">
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'family-law' && <ApiKeyGuard><FamilyLawSpecialist /></ApiKeyGuard>}
          {currentView === 'official-notice' && <ApiKeyGuard><OfficialNoticeAssistant /></ApiKeyGuard>}
          {currentView === 'exequatur' && <ApiKeyGuard><ExequaturAssistant /></ApiKeyGuard>}
          {currentView === 'auction' && <ApiKeyGuard><AuctionSpecialist /></ApiKeyGuard>}
          {currentView === 'trade-fund' && <ApiKeyGuard><TradeFundSpecialist /></ApiKeyGuard>}
          {currentView === 'insurance-claim' && <ApiKeyGuard><InsuranceClaimAssistant /></ApiKeyGuard>}
          {currentView === 'attachment-studio' && <ApiKeyGuard><PrecautionaryAttachmentStudio /></ApiKeyGuard>}
          {currentView === 'arbitration' && <ApiKeyGuard><ArbitrationClauseBuilder /></ApiKeyGuard>}
          {currentView === 'constitutional' && <ApiKeyGuard><ConstitutionalAssistant /></ApiKeyGuard>}
          {currentView === 'agreement-builder' && <ApiKeyGuard><LegalAgreementBuilder /></ApiKeyGuard>}
          {currentView === 'morning-brief' && <ApiKeyGuard><MorningBriefing /></ApiKeyGuard>}
          {currentView === 'admin-law' && <ApiKeyGuard><AdminLitigationSpecialist /></ApiKeyGuard>}
          {currentView === 'real-estate' && <ApiKeyGuard><RealEstateSpecialist /></ApiKeyGuard>}
          {currentView === 'company-formation' && <ApiKeyGuard><CompanyFormationAssistant /></ApiKeyGuard>}
          {currentView === 'labor-mediation' && <ApiKeyGuard><LaborMediationTool /></ApiKeyGuard>}
          {currentView === 'virtual-court' && <ApiKeyGuard><VirtualCourtroom /></ApiKeyGuard>}
          {currentView === 'status-report' && <ApiKeyGuard><ClientStatusReporter /></ApiKeyGuard>}
          {currentView === 'cassation' && <ApiKeyGuard><CassationDraftingStudio /></ApiKeyGuard>}
          {currentView === 'legal-advice' && <ApiKeyGuard><LegalAdviceGenerator /></ApiKeyGuard>}
          {currentView === 'injunction' && <ApiKeyGuard><InjunctionGenerator /></ApiKeyGuard>}
          {currentView === 'witness-prep' && <ApiKeyGuard><WitnessPrepTool /></ApiKeyGuard>}
          {currentView === 'draft-history' && <DraftHistory />}
          {currentView === 'rebuttal' && <ApiKeyGuard><RebuttalGenerator /></ApiKeyGuard>}
          {currentView === 'hearing-report' && <ApiKeyGuard><HearingSummaryGenerator /></ApiKeyGuard>}
          {currentView === 'draft-studio' && <ApiKeyGuard><SmartDraftingStudio /></ApiKeyGuard>}
          {currentView === 'expert-analyzer' && <ApiKeyGuard><JudicialExpertiseAnalyzer /></ApiKeyGuard>}
          {currentView === 'compliance' && <LegislativeCompliance />}
          {currentView === 'data-mgr' && <DataManagement />}
          {currentView === 'live-scan' && <ApiKeyGuard><LiveScanner /></ApiKeyGuard>}
          {currentView === 'court-list' && <DailyCourtList />}
          {currentView === 'expenses' && <OfficeExpenses />}
          {currentView === 'appeal-strategy' && <ApiKeyGuard><AppealGroundsGenerator /></ApiKeyGuard>}
          {currentView === 'criminal-sentences' && <ApiKeyGuard><CriminalSentenceGuide /></ApiKeyGuard>}
          {currentView === 'contract-ai' && <ApiKeyGuard><ContractAnalyzer /></ApiKeyGuard>}
          {currentView === 'appointments' && <AppointmentManager />}
          {currentView === 'codes' && <KnowledgeBase />}
          {currentView === 'analytics' && <AnalyticsReport />}
          {currentView === 'invoices' && <InvoiceManager />}
          {currentView === 'legal-ai' && <ApiKeyGuard><LegalAssistant /></ApiKeyGuard>}
          {currentView === 'case-tracking' && <CaseTracking onAddHearing={(id) => navigateToWithDossier('hearings-add', id)} />}
          {currentView === 'hearings-list' && <HearingList />}
          {currentView === 'deadlines' && <ApiKeyGuard><LegalDeadlineCalculator /></ApiKeyGuard>}
          {currentView === 'executions' && <ExecutionTracker />}
          {currentView === 'evidence' && <EvidenceVault />}
          {currentView === 'jurisprudence' && <ApiKeyGuard><JurisprudenceExplorer /></ApiKeyGuard>}
          {currentView === 'law-library' && <ApiKeyGuard><LawLibrary /></ApiKeyGuard>}
          {currentView === 'court-map' && <ApiKeyGuard><CourtExplorer /></ApiKeyGuard>}
          {currentView === 'news' && <ApiKeyGuard><LegalNews /></ApiKeyGuard>}
          {currentView === 'client-ledger' && <ClientLedger />}
          {currentView === 'tax-calc' && <TaxCalculator />}
          {currentView === 'fees' && <FeesForm initialDossierId={selectedDossierId} />}
          {currentView === 'clients-list' && <ClientList onEditClient={(id) => navigateToWithClient('clients-edit', id)} />}
          {currentView === 'clients-add' && <ClientForm />}
          {currentView === 'clients-edit' && <ClientForm initialClientId={selectedClientId} />}
          {currentView === 'archive' && <DocumentArchive initialDossierId={selectedDossierId} />}
          {currentView === 'mails' && <MailManager />}
          {currentView === 'conflicts' && <ApiKeyGuard><ConflictChecker /></ApiKeyGuard>}
          {currentView === 'settings' && <Settings />}
          {currentView === 'dossiers-list' && <CaseList onQuickAction={navigateToWithDossier} />}
          {currentView === 'dossiers-add' && <CaseForm />}
          {currentView === 'dossiers-edit' && <CaseForm initialDossierId={selectedDossierId} />}
          {currentView === 'dossier-details' && selectedDossierId && <CaseDetails dossierId={selectedDossierId} onBack={() => handleMenuClick('case-tracking')} />}
          {currentView === 'hearings-add' && <HearingForm initialDossierId={selectedDossierId} />}
          {currentView === 'procedure-guide' && <ApiKeyGuard><ProcedureGuide /></ApiKeyGuard>}
          {currentView === 'docs' && <ApiKeyGuard><DocumentGenerator /></ApiKeyGuard>}
          {currentView === 'bordereau' && <BordereauGenerator />}
          {currentView === 'tasks' && <Tasks />}
          {current