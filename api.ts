
const mockDB = {
  get: (key: string) => {
    const data = localStorage.getItem(`avocat_pro_${key}`);
    return data ? JSON.parse(data) : null;
  },
  set: (key: string, data: any) => {
    localStorage.setItem(`avocat_pro_${key}`, JSON.stringify(data));
  },
  init: () => {
    if (!mockDB.get('clients')) mockDB.set('clients', [
      { id: 1, nom_complet: 'أحمد العلمي', cin: 'AB123456', telephone: '0661223344', email: 'ahmed@mail.com', adresse: 'شارع الزرقطوني، الدار البيضاء' }
    ]);
    if (!mockDB.get('procedures')) mockDB.set('procedures', [
      { id: 101, dossier_id: 1, type: 'مقال افتتاحي (الموضوع)', date_debut: '2024-01-10', statut: 'منتهية' },
      { id: 102, dossier_id: 1, type: 'طلب حجز تحفظي', date_debut: '2024-02-15', statut: 'جارية' },
      { id: 103, dossier_id: 1, type: 'تبليغ حكم تمهيدي', date_debut: '2024-03-05', statut: 'منتهية' }
    ]);
    if (!mockDB.get('dossiers')) mockDB.set('dossiers', [
      { id: 1, numero_mahakim: '2024/1201/1', titre_affaire: 'نزاع تجاري - شركة إكس', type_affaire: 'Commercial', statut: 'En cours', tribunal: 'المحكمة التجارية بالدار البيضاء', client_id: 1, client_name: 'أحمد العلمي', montant_total: 15000, avance: 5000, reste: 10000, created_at: new Date().toISOString() }
    ]);
    if (!mockDB.get('staff')) mockDB.set('staff', [
      { id: 1, name: 'الأستاذ المهني', role: 'Avocat Principal', color: '#4f46e5' },
      { id: 2, name: 'سارة العلمي', role: 'Secrétaire', color: '#ec4899' }
    ]);
    if (!mockDB.get('tasks')) mockDB.set('tasks', [
      { id: 1, dossier_id: 1, title: 'تحضير مذكرات الدفاع', status: 'pending', deadline: new Date().toISOString(), priority: 'high', assigned_to: 1 }
    ]);
    if (!mockDB.get('audiences')) mockDB.set('audiences', []);
    if (!mockDB.get('settings')) mockDB.set('settings', { name: 'مكتب الأستاذ المهني', address: 'شارع الزرقطوني، الدار البيضاء', barreau: 'الدار البيضاء', tva_rate: 10, ice: '001234567890012', if: '12345678' });
    if (!mockDB.get('documents')) mockDB.set('documents', []);
    if (!mockDB.get('mails')) mockDB.set('mails', []);
    if (!mockDB.get('executions')) mockDB.set('executions', []);
    if (!mockDB.get('drafts')) mockDB.set('drafts', []);
  }
};

mockDB.init();

export const api = {
  checkConnection: async () => true,
  
  getStats: async () => {
    const dossiers = mockDB.get('dossiers') || [];
    const audiences = mockDB.get('audiences') || [];
    const clients = mockDB.get('clients') || [];
    const tasks = mockDB.get('tasks') || [];
    const executions = mockDB.get('executions') || [];
    
    const today = new Date().toISOString().split('T')[0];
    const todayHearings = audiences.filter((h: any) => h.date_audience && h.date_audience.split('T')[0] === today).length;

    let totalPending = 0;
    let totalCollected = 0;
    dossiers.forEach((d: any) => {
      totalPending += (d.reste || 0);
      totalCollected += (d.avance || 0);
    });

    return {
      active_cases: dossiers.filter((d: any) => d.statut === 'En cours').length,
      today_hearings: todayHearings,
      total_clients: clients.length,
      total_pending_fees: totalPending,
      total_collected_fees: totalCollected,
      pending_tasks: tasks.filter((t: any) => t.status === 'pending').length,
      active_executions: executions.filter((e: any) => e.status === 'In progress').length
    };
  },

  getClients: async () => mockDB.get('clients') || [],
  getClient: async (id: string) => (mockDB.get('clients') || []).find((c: any) => c.id.toString() === id),
  addClient: async (data: any) => {
    const list = mockDB.get('clients') || [];
    const newItem = { ...data, id: Date.now() };
    mockDB.set('clients', [...list, newItem]);
    return newItem;
  },
  updateClient: async (id: string, data: any) => {
    const list = mockDB.get('clients') || [];
    const updated = list.map((item: any) => item.id.toString() === id.toString() ? { ...item, ...data } : item);
    mockDB.set('clients', updated);
    return true;
  },
  deleteClient: async (id: string) => {
    const list = mockDB.get('clients') || [];
    const filtered = list.filter((item: any) => item.id.toString() !== id.toString());
    mockDB.set('clients', filtered);
    return true;
  },

  getDossiers: async () => {
    const dossiers = mockDB.get('dossiers') || [];
    const procedures = mockDB.get('procedures') || [];
    const clients = mockDB.get('clients') || [];
    return dossiers.map((d: any) => {
      const client = clients.find((c: any) => c.id.toString() === d.client_id?.toString());
      return {
        ...d,
        client_name: client ? client.nom_complet : 'غير معروف',
        procedures: procedures.filter((p: any) => p.dossier_id === d.id)
      };
    });
  },
  getDossier: async (id: string) => {
    const dossiers = await api.getDossiers();
    return dossiers.find((d: any) => d.id.toString() === id) || null;
  },
  addDossier: async (data: any) => {
    const list = mockDB.get('dossiers') || [];
    const newItem = { ...data, id: Date.now(), created_at: new Date().toISOString(), reste: 0, avance: 0, montant_total: 0 };
    mockDB.set('dossiers', [...list, newItem]);
    return newItem;
  },
  updateDossier: async (id: string, data: any) => {
    const list = mockDB.get('dossiers') || [];
    const updated = list.map((item: any) => item.id.toString() === id.toString() ? { ...item, ...data } : item);
    mockDB.set('dossiers', updated);
    return true;
  },
  updateDossierStatus: async (id: string, status: string) => {
    const list = mockDB.get('dossiers') || [];
    const updated = list.map((item: any) => item.id.toString() === id.toString() ? { ...item, statut: status } : item);
    mockDB.set('dossiers', updated);
    return true;
  },
  deleteDossier: async (id: string) => {
    const list = mockDB.get('dossiers') || [];
    const filtered = list.filter((item: any) => item.id.toString() !== id.toString());
    mockDB.set('dossiers', filtered);
    return true;
  },

  updateFees: async (data: any) => {
    const list = mockDB.get('dossiers') || [];
    const ht = parseFloat(data.montant_total || '0');
    const tva = ht * 0.10;
    const taxes = parseFloat(data.taxes || '0');
    const ttc = ht + tva + taxes;
    const avance = parseFloat(data.avance || '0');
    
    const updated = list.map((item: any) => 
      item.id.toString() === data.dossier_id.toString() 
        ? { ...item, montant_total: ht, avance: avance, taxes: taxes, reste: ttc - avance } 
        : item
    );
    mockDB.set('dossiers', updated);
    return true;
  },

  getStaff: async () => mockDB.get('staff') || [],
  addStaff: async (data: any) => {
    const staff = mockDB.get('staff') || [];
    const newMember = { ...data, id: Date.now() };
    mockDB.set('staff', [...staff, newMember]);
    return newMember;
  },

  getTasks: async () => {
    const tasks = mockDB.get('tasks') || [];
    const dossiers = mockDB.get('dossiers') || [];
    return tasks.map((t: any) => {
      const dossier = dossiers.find((d: any) => d.id.toString() === t.dossier_id?.toString());
      return { ...t, numero_mahakim: dossier ? dossier.numero_mahakim : '' };
    });
  },
  addTask: async (data: any) => {
    const tasks = mockDB.get('tasks') || [];
    const newTask = { ...data, id: Date.now(), status: 'pending' };
    mockDB.set('tasks', [...tasks, newTask]);
    return newTask;
  },
  updateTaskStatus: async (id: string, status: string) => {
    const tasks = mockDB.get('tasks') || [];
    const updated = tasks.map((t: any) => t.id.toString() === id ? { ...t, status } : t);
    mockDB.set('tasks', updated);
    return true;
  },

  getAudiences: async () => {
    const audiences = mockDB.get('audiences') || [];
    const dossiers = await api.getDossiers();
    return audiences.map((a: any) => {
      const dossier = dossiers.find((d: any) => d.id.toString() === a.dossier_id?.toString());
      return {
        ...a,
        numero_mahakim: dossier ? dossier.numero_mahakim : '',
        titre_affaire: dossier ? dossier.titre_affaire : '',
        tribunal: dossier ? dossier.tribunal : '',
        client_name: dossier ? dossier.client_name : ''
      };
    });
  },
  addAudience: async (data: any) => {
    const list = mockDB.get('audiences') || [];
    const newItem = { ...data, id: Date.now() };
    mockDB.set('audiences', [...list, newItem]);
    return newItem;
  },
  deleteAudience: async (id: string) => {
    const list = mockDB.get('audiences') || [];
    const filtered = list.filter((item: any) => item.id.toString() !== id.toString());
    mockDB.set('audiences', filtered);
    return true;
  },

  getSettings: async () => mockDB.get('settings'),
  saveSettings: async (data: any) => {
    mockDB.set('settings', data);
    return true;
  },

  getDocuments: async (dossierId: string) => {
    const all = mockDB.get('documents') || [];
    return all.filter((doc: any) => doc.dossier_id.toString() === dossierId.toString());
  },
  addDocument: async (data: any) => {
    const all = mockDB.get('documents') || [];
    const newItem = { ...data, id: Date.now() };
    mockDB.set('documents', [...all, newItem]);
    return newItem;
  },
  deleteDocument: async (id: string) => {
    const all = mockDB.get('documents') || [];
    const filtered = all.filter((doc: any) => doc.id.toString() !== id.toString());
    mockDB.set('documents', filtered);
    return true;
  },

  getExecutions: async () => mockDB.get('executions') || [],
  addExecution: async (data: any) => {
    const all = mockDB.get('executions') || [];
    const newItem = { ...data, id: Date.now(), status: 'In progress' };
    mockDB.set('executions', [...all, newItem]);
    return newItem;
  },

  getMails: async () => mockDB.get('mails') || [],
  addMail: async (data: any) => {
    const list = mockDB.get('mails') || [];
    const newItem = { ...data, id: Date.now() };
    mockDB.set('mails', [...list, newItem]);
    return newItem;
  },
  deleteMail: async (id: string) => {
    const list = mockDB.get('mails') || [];
    const filtered = list.filter((item: any) => item.id.toString() !== id.toString());
    mockDB.set('mails', filtered);
    return true;
  },

  getDrafts: async () => mockDB.get('drafts') || [],
  saveDraft: async (data: any) => {
    const list = mockDB.get('drafts') || [];
    const newItem = { ...data, id: Date.now() };
    mockDB.set('drafts', [...list, newItem]);
    return newItem;
  },
  deleteDraft: async (id: number) => {
    const list = mockDB.get('drafts') || [];
    const filtered = list.filter((item: any) => item.id !== id);
    mockDB.set('drafts', filtered);
    return true;
  }
};
