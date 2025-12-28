
import React, { useState, useEffect } from 'react';
import { api } from '../api';

const StaffManager: React.FC = () => {
  const [staff, setStaff] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMember, setNewMember] = useState({ name: '', role: 'Avocat', color: '#6366f1' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [staffData, tasksData] = await Promise.all([api.getStaff(), api.getTasks()]);
    setStaff(staffData || []);
    setTasks(tasksData || []);
    setLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.addStaff(newMember);
    setNewMember({ name: '', role: 'Avocat', color: '#6366f1' });
    loadData();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 text-right" dir="rtl">
      <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100">
        <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
          <i className="fa-solid fa-users-gear text-indigo-500"></i>
          إدارة فريق عمل المكتب والمهام
        </h3>

        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-10 pb-10 border-b border-slate-50">
          <div className="md:col-span-1">
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">اسم العضو</label>
            <input 
              type="text" 
              className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
              placeholder="الاسم الكامل..."
              value={newMember.name}
              onChange={e => setNewMember({...newMember, name: e.target.value})}
              required
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">الصفة / الدور</label>
            <select 
              className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
              value={newMember.role}
              onChange={e => setNewMember({...newMember, role: e.target.value})}
            >
              <option value="Avocat Principal">محامٍ رئيسي</option>
              <option value="Avocat">محامٍ</option>
              <option value="Secrétaire">مساعد(ة) إداري(ة)</option>
              <option value="Clerc">كاتب(ة) المحاماة</option>
            </select>
          </div>
          <div className="md:col-span-1">
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">اللون التمييزي</label>
            <input 
              type="color" 
              className="w-full h-10 border border-slate-200 rounded-xl p-1 cursor-pointer"
              value={newMember.color}
              onChange={e => setNewMember({...newMember, color: e.target.value})}
            />
          </div>
          <button type="submit" className="bg-indigo-600 text-white font-black py-3 rounded-xl shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
            <i className="fa-solid fa-plus-circle"></i>
            إضافة للفريق
          </button>
        </form>

        <div className="overflow-x-auto rounded-3xl border border-slate-100 shadow-sm bg-slate-50/30">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-900 text-[10px] font-black text-white uppercase tracking-widest">
                <th className="p-5">العضو</th>
                <th className="p-5">الدور</th>
                <th className="p-5">المهام الجارية (بصفة محرر)</th>
                <th className="p-5 text-center">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staff.map(member => {
                const assignedTasks = tasks.filter(t => t.assigned_to?.toString() === member.id.toString() && t.status === 'pending');
                return (
                  <tr key={member.id} className="hover:bg-indigo-50/30 transition-colors group bg-white">
                    <td className="p-5 border-l border-slate-50">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg font-black shadow-lg" style={{ backgroundColor: member.color }}>
                          {member.name.charAt(0)}
                        </div>
                        <div>
                           <p className="font-black text-slate-800 text-sm">{member.name}</p>
                           <p className="text-[9px] text-slate-400 font-bold">معرف: #{member.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5 font-bold text-xs text-indigo-600">
                      {member.role}
                    </td>
                    <td className="p-5">
                      <div className="flex flex-wrap gap-2">
                        {assignedTasks.length > 0 ? assignedTasks.map(t => (
                          <div key={t.id} className="bg-white border border-slate-200 px-3 py-1 rounded-lg shadow-sm flex items-center gap-2">
                            <i className="fa-solid fa-pen-nib text-[10px] text-indigo-400"></i>
                            <span className="text-[10px] font-bold text-slate-600">{t.title}</span>
                          </div>
                        )) : (
                          <span className="text-[10px] text-slate-300 italic font-medium">لا توجد مهام حالية</span>
                        )}
                      </div>
                    </td>
                    <td className="p-5 text-center">
                      <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black px-2 py-1 rounded-full border border-emerald-100 uppercase">نشط</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffManager;
