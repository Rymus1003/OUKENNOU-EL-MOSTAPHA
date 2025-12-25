
import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Client } from '../types';

const ClientList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const data = await api.getClients();
      setClients(data);
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client => 
    client.nom_complet.toLowerCase().includes(searchTerm.toLowerCase()) || 
    client.cin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="w3-card-4 bg-white p-6 rounded-xl border-r-4 border-indigo-500 shadow-sm transition-all hover:shadow-md">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex items-center gap-4 flex-1 w-full">
            <label className="min-w-[150px] flex items-center gap-2 font-bold text-slate-700">
              <i className="fa-solid fa-magnifying-glass text-indigo-500"></i>
              <span>بحث عن موكل:</span>
            </label>
            <input 
              type="text" 
              className="flex-1 border-b-2 border-slate-200 focus:border-indigo-500 outline-none py-2 bg-transparent font-medium transition-colors"
              placeholder="ابحث بالاسم الكامل أو رقم البطاقة الوطنية (CIN)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-xs text-slate-400 font-medium">
            نتائج البحث: <span className="text-indigo-600 font-bold">{filteredClients.length}</span>
          </div>
        </div>
      </div>

      <div className="w3-card-4 bg-white rounded-xl overflow-hidden shadow-lg">
        <header className="w3-container w3-indigo p-4 flex justify-between items-center">
          <h3 className="font-bold flex items-center gap-2 m-0 text-white">
            <i className="fa-solid fa-users-viewfinder"></i>
            قائمة الموكلين المسجلين
          </h3>
        </header>
        <div className="w3-container p-0">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-10 text-center text-slate-400">جاري تحميل البيانات...</div>
            ) : (
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b">
                    <th className="p-4 text-sm font-bold">الاسم الكامل</th>
                    <th className="p-4 text-sm font-bold">رقم البطاقة / السجل</th>
                    <th className="p-4 text-sm font-bold">الهاتف</th>
                    <th className="p-4 text-sm font-bold">البريد الإلكتروني</th>
                    <th className="p-4 text-sm font-bold text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredClients.map(client => (
                    <tr key={client.id} className="hover:bg-indigo-50/50 transition-colors group">
                      <td className="p-4">
                        <div className="font-bold text-indigo-900">{client.nom_complet}</div>
                      </td>
                      <td className="p-4 text-gray-600 font-mono text-sm tracking-wider uppercase">{client.cin}</td>
                      <td className="p-4 text-gray-600 text-sm">{client.telephone}</td>
                      <td className="p-4 text-gray-500 text-sm italic">{client.email}</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button className="w3-button w3-tiny w3-blue w3-round p-2" title="تعديل">
                            <i className="fa-solid fa-pen-to-square"></i>
                          </button>
                          <button className="w3-button w3-tiny w3-red w3-round p-2" title="حذف">
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredClients.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-slate-400 italic">
                        <i className="fa-solid fa-user-slash text-4xl mb-4 block opacity-20"></i>
                        لا يوجد موكل بهذا الاسم أو رقم البطاقة
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientList;
