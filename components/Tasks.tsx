
import React, { useState, useEffect } from 'react';
import { api } from '../api';

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [dossiers, setDossiers] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({ title: '', dossier_id: '', deadline: '', priority: 'medium', assigned_to: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [tasksData, dossiersData, staffData] = await Promise.all([
      api.getTasks(), 
      api.getDossiers(),
      api.getStaff()
    ]);
    setTasks(tasksData || []);
    setDossiers(dossiersData || []);
    setStaff(staffData || []);
    setLoading(false);
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) return;
    await api.addTask(newTask);
    setNewTask({ title: '', dossier_id: '', deadline: '', priority: 'medium', assigned_to: '' });
    await loadData();
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    await api.updateTaskStatus(id, nextStatus);
    await loadData();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-right" dir="rtl">
      {/* Add Task Form */}
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2">
            <i className="fa-solid fa-plus-circle text-cyan-500"></i>
            إضافة مهمة جديدة
          </h3>
          <form onSubmit={handleAddTask} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">وصف المهمة</label>
              <input 
                type="text" 
                className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-cyan-100 outline-none font-bold"
                placeholder="مثال: مراجعة الشهود، سحب نسخة الحكم..."
                value={newTask.title}
                onChange={e => setNewTask({...newTask, title: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">المحرر المكلف (Writer)</label>
              <select 
                className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-cyan-100 outline-none font-bold text-indigo-600"
                value={newTask.assigned_to}
                onChange={e => setNewTask({...newTask, assigned_to: e.target.value})}
              >
                <option value="">-- اختر العضو المسؤول --</option>
                {staff.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">مرتبطة بملف</label>
              <select 
                className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-cyan-100 outline-none"
                value={newTask.dossier_id}
                onChange={e => setNewTask({...newTask, dossier_id: e.target.value})}
              >
                <option value="">-- مهمة عامة --</option>
                {dossiers.map(d => (
                  <option key={d.id} value={d.id}>{d.numero_mahakim} - {d.titre_affaire}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">آخر أجل</label>
                <input 
                  type="date" 
                  className="w-full border border-slate-200 rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-cyan-100 outline-none"
                  value={newTask.deadline}
                  onChange={e => setNewTask({...newTask, deadline: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">الأولوية</label>
                <select 
                  className="w-full border border-slate-200 rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-cyan-100 outline-none"
                  value={newTask.priority}
                  onChange={e => setNewTask({...newTask, priority: e.target.value})}
                >
                  <option value="low">عادية</option>
                  <option value="medium">متوسطة</option>
                  <option value="high">مستعجلة</option>
                </select>
              </div>
            </div>
            <button type="submit" className="w-full bg-cyan-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-cyan-700 transition-all mt-4">حفظ المهمة وتكليف المحرر</button>
          </form>
        </div>
      </div>

      {/* Task List */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden min-h-[500px]">
          <header className="p-6 bg-slate-50 border-b flex justify-between items-center">
            <h3 className="font-black text-slate-800 m-0 flex items-center gap-2">
              <i className="fa-solid fa-tasks text-cyan-600"></i>
              قائمة المهام العالقة
            </h3>
            <span className="bg-cyan-100 text-cyan-700 text-[10px] font-black px-2 py-1 rounded-lg border border-cyan-200 uppercase">
              {tasks.filter(t => t.status === 'pending').length} مهمة متبقية
            </span>
          </header>
          
          <div className="p-0">
            {loading ? <div className="p-20 text-center animate-pulse text-slate-400 font-bold">جاري تحميل قائمة المهام...</div> : (
              <div className="divide-y divide-slate-50">
                {tasks.map(task => {
                  const assignedStaff = staff.find(s => s.id.toString() === task.assigned_to?.toString());
                  return (
                    <div key={task.id} className={`p-5 flex items-center justify-between hover:bg-slate-50 transition-all ${task.status === 'completed' ? 'opacity-50' : ''}`}>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => toggleStatus(task.id, task.status)}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${task.status === 'completed' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 hover:border-cyan-500'}`}
                        >
                          {task.status === 'completed' && <i className="fa-solid fa-check text-[10px]"></i>}
                        </button>
                        <div>
                          <p className={`font-bold text-sm ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-800'}`}>{task.title}</p>
                          <div className="flex flex-wrap items-center gap-3 mt-1.5">
                            {task.numero_mahakim && <span className="text-[9px] text-indigo-500 font-bold bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">ملف: {task.numero_mahakim}</span>}
                            {assignedStaff && (
                               <span className="text-[9px] font-black text-cyan-600 flex items-center gap-1">
                                  <i className="fa-solid fa-user-pen"></i>
                                  المحرر: {assignedStaff.name}
                               </span>
                            )}
                            {task.deadline && (
                              <span className="text-[9px] text-slate-400 font-bold flex items-center gap-1">
                                <i className="fa-solid fa-calendar-day"></i> 
                                {new Date(task.deadline).toLocaleDateString('ar-MA')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div>
                         <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase ${task.priority === 'high' ? 'bg-rose-100 text-rose-600' : task.priority === 'medium' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                           {task.priority === 'high' ? 'مستعجل' : task.priority === 'medium' ? 'متوسط' : 'عادي'}
                         </span>
                      </div>
                    </div>
                  );
                })}
                {tasks.length === 0 && <div className="p-20 text-center text-slate-300 italic font-bold">لا توجد مهام حالياً</div>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
