
import React, { useState, useEffect } from 'react';
import FeesForm from './FeesForm';
import OfficeExpenses from './OfficeExpenses';
import ClientLedger from './ClientLedger';
import { api } from '../api';

interface FinanceHubProps {
  initialDossierId?: string | null;
}

const FinanceHub: React.FC<FinanceHubProps> = ({ initialDossierId }) => {
  const [activeTab, setActiveTab] = useState<'fees' | 'expenses' | 'ledger'>('fees');
  const [stats, setStats] = useState({ 
    total_collected_fees: 0, 
    total_pending_fees: 0,
    office_expenses: 0
  });

  useEffect(() => {
    loadFinanceStats();
  }, [activeTab]);

  const loadFinanceStats = async () => {
    const s = await api.getStats();
    // Simulate office expenses if not in api stats yet
    const exp = localStorage.getItem('office_expenses');
    const expensesTotal = exp ? JSON.parse(exp).reduce((acc: number, e: any) => acc + parseFloat(e.amount), 0) : 0;
    
    setStats({
      total_collected_fees: s.total_collected_fees,
      total_pending_fees: s.total_pending_fees,
      office_expenses: expensesTotal
    });
  };

  const netProfit = stats.total_collected_fees - stats.office_expenses;

  return (
    <div className="space-y-8 text-right" dir="rtl">
      {/* Finance Executive Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="المداخيل المحصلة (TTC)" value={stats.total_collected_fees} icon="fa-hand-holding-dollar" color="bg-emerald-600" />
        <StatCard label="المستحقات العالقة" value={stats.total_pending_fees} icon="fa-hourglass-half" color="bg-amber-500" />
        <StatCard label="نفقات المكتب" value={stats.office_expenses} icon="fa-file-invoice-dollar" color="bg-rose-500" />
        <div className="bg-slate-900 p-6 rounded-[2rem] shadow-xl text-white">
           <div className="flex justify-between items-center">
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">الربح الصافي</p>
                 <h3 className="text-xl font-black">{netProfit.toLocaleString()} <span className="text-xs">د.م</span></h3>
              </div>
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                 <i className="fa-solid fa-chart-line text-lg"></i>
              </div>
           </div>
        </div>
      </div>

      {/* Internal Navigation */}
      <div className="flex gap-2 p-1 bg-white rounded-2xl shadow-sm border border-slate-100 max-w-fit mx-auto">
        <TabButton 
          active={activeTab === 'fees'} 
          onClick={() => setActiveTab('fees')} 
          icon="fa-receipt" 
          label="الأتعاب والفوترة" 
        />
        <TabButton 
          active={activeTab === 'expenses'} 
          onClick={() => setActiveTab('expenses')} 
          icon="fa-wallet" 
          label="نفقات المكتب" 
        />
        <TabButton 
          active={activeTab === 'ledger'} 
          onClick={() => setActiveTab('ledger')} 
          icon="fa-book-open" 
          label="دفتر الحسابات الموحد" 
        />
      </div>

      {/* Module Container */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === 'fees' && <FeesForm initialDossierId={initialDossierId} />}
        {activeTab === 'expenses' && <OfficeExpenses />}
        {activeTab === 'ledger' && <ClientLedger />}
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, color }: any) => (
  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between">
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-xl font-black text-slate-800">{value.toLocaleString()} <span className="text-xs font-bold text-slate-400">د.م</span></h3>
    </div>
    <div className={`${color} text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg`}>
      <i className={`fa-solid ${icon} text-lg`}></i>
    </div>
  </div>
);

const TabButton = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`px-6 py-3 rounded-xl flex items-center gap-3 transition-all text-sm font-black ${active ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
  >
    <i className={`fa-solid ${icon}`}></i>
    <span>{label}</span>
  </button>
);

export default FinanceHub;
