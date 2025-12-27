
const API_BASE_URL = window.location.origin.includes('localhost') ? 'http://localhost:3001/api' : '/api';

// --- مساعدات التخزين المحلي المحاكي (Mock DB) ---
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
      { id: 1, nom_complet: 'أحمد العلمي', cin: 'AB123456', telephone: '0661223344', email: 'ahmed@mail.com', adresse: 'شارع الزرقطوني، الدار البيضاء' },
      { id: 2, nom_complet: 'فاطمة الزهراء الشاوي', cin: 'CD789012', telephone: '0661556677', email: 'fatima@mail.com', adresse: 'حي الرياض، الرباط' }
    ]);
    if (!mockDB.get('dossiers')) mockDB.set('dossiers', [
      { id: 1, numero_mahakim: '2024/1201/1', titre_affaire: 'نزاع تجاري - شركة إكس', type_affaire: 'Commercial', statut: 'En cours', tribunal: 'المحكمة التجارية بالدار البيضاء', client_id: 1, client_name: 'أحمد العلمي', client_cin: 'AB123456', juge: 'الأستاذ بناني', montant_total: 15000, avance: 5000, reste: 10000, tva: 1500, taxes: 500, created_at: new Date().toISOString() }
    ]);
    if (!mockDB.get('staff')) mockDB.set('staff', [
      { id: 1, name: 'الأستاذ المهني', role: 'Avocat Principal', color: '#4f46e5' },
      { id: 2, name: 'سارة العلمي', role: 'Secrétaire', color: '#ec4899' },
      { id: 3, name: 'ياسين بن جلون', role: 'Avocat Stagiaire', color: '#10b981' }
    ]);
    if (!mockDB.get('executions')) mockDB.set('executions', [
      { id: 1, dossier_id: 1, num_execution: '2024/505', huissier: 'الأستاذ المرزوقي', status: 'In progress', last_action: 'تبليغ السند التنفيذي', next_action: 'إجراء الحجز', date: new Date().toISOString() }
    ]);
    if (!mockDB.get('tasks')) mockDB.set('tasks', [
      { id: 1, dossier_id: 1, title: 'إعداد المذكرة التعقيبية', status: 'pending', deadline: new Date(Date.now() + 172800000).toISOString(), priority: 'high', assigned_to: 1 }
    ]);
    if (!mockDB.get('ai_drafts')) mockDB.set('ai_drafts', []);
    if (!mockDB.get('cabinet_settings')) mockDB.set('cabinet_settings', {
      name: 'مكتب الأستاذ المهني للمحاماة',
      address: 'شارع محمد الخامس، عمارة النجاح، الدار البيضاء',
      barreau: 'الدار البيضاء',
      tva_rate: 10
    });
  }
};

mockDB.init();

const handleFetch = async (url: string, options?: RequestInit, fallbackKey?: string) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error('Backend Error');
    return await response.json();
  } catch (error) {
    if (fallbackKey) {
      if (url.includes('/stats')) {
        const dossiers = mockDB.get('dossiers') || [];
        const clients = mockDB.get('clients') || [];
        const tasks = mockDB.get('tasks') || [];
        const execs = mockDB.get('executions') || [];
        const pending = dossiers.reduce((acc: number, d: any) => acc + (d.reste || 0), 0);
        const collected = dossiers.reduce((acc: number, d: any) => acc + (d.avance || 0), 0);
        
        return {
          active_cases: dossiers.filter((d: any) => d.statut === 'En cours').length,
          today_hearings: 1,
          total_clients: clients.length,
          total_pending_fees: pending,
          total_collected_fees: collected,
          pending_tasks: tasks.filter((t: any) => t.status === 'pending').length,
          active_executions: execs.length
        };
      }
      return mockDB.get(fallbackKey);
    }
    return null;
  }
};

export const api = {
  checkConnection: async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);
      const res = await fetch(`${API_BASE_URL}/stats`, { method: 'HEAD', signal: controller.signal });
      clearTimeout(timeoutId);
      return res.ok;
    } catch { return false; }
  },
  
  getStats: () => handleFetch(`${API_BASE_URL}/stats`, {}, 'stats'),
  
  // Clients & Dossiers
  getClients: () => handleFetch(`${API_BASE_URL}/clients`, {}, 'clients'),
  getClient: (id: string) => Promise.resolve((mockDB.get('clients') || []).find((c: any) => c.id.toString() === id) || null),
  addClient: (data: any) => {
     const clients = mockDB.get('clients') || [];
     const newClient = {...data, id: Date.now()};
     mockDB.set('clients', [...clients, newClient]);
     return Promise.resolve(newClient);
  },
  updateClient: (id: string, data: any) => {
     const clients = mockDB.get('clients') || [];
     const updated = clients.map((c: any) => c.id.toString() === id ? {...c, ...data} : c);
     mockDB.set('clients', updated);
     return Promise.resolve(true);
  },
  deleteClient: (id: string) => {
     const clients = mockDB.get('clients') || [];
     mockDB.set('clients', clients.filter((c: any) => c.id.toString() !== id));
     return Promise.resolve(true);
  },
  
  getDossiers: () => handleFetch(`${API_BASE_URL}/dossiers`, {}, 'dossiers'),
  getDossier: (id: string) => Promise.resolve((mockDB.get('dossiers') || []).find((d: any) => d.id.toString() === id) || null),
  addDossier: (data: any) => {
     const dossiers = mockDB.get('dossiers') || [];
     const newDossier = {...data, id: Date.now(), reste: data.montant_total - data.avance, created_at: new Date().toISOString()};
     mockDB.set('dossiers', [...dossiers, newDossier]);
     return Promise.resolve(newDossier);
  },
  updateDossier: (id: string, data: any) => {
     const dossiers = mockDB.get('dossiers') || [];
     const updated = dossiers.map((d: any) => d.id.toString() === id ? {...d, ...data} : d);
     mockDB.set('dossiers', updated);
     return Promise.resolve(true);
  },
  updateDossierStatus: (id: string, status: string) => {
     const dossiers = mockDB.get('dossiers') || [];
     const updated = dossiers.map((d: any) => d.id.toString() === id ? {...d, statut: status} : d);
     mockDB.set('dossiers', updated);
     return Promise.resolve(true);
  },
  deleteDossier: (id: string) => {
     const dossiers = mockDB.get('dossiers') || [];
     mockDB.set('dossiers', dossiers.filter((d: any) => d.id.toString() !== id));
     return Promise.resolve(true);
  },

  // AI Drafts History
  getDrafts: () => Promise.resolve(mockDB.get('ai_drafts') || []),
  saveDraft: (data: { title: string, content: string, type: string }) => {
    const drafts = mockDB.get('ai_drafts') || [];
    const newDraft = { ...data, id: Date.now(), date: new Date().toISOString() };
    mockDB.set('ai_drafts', [newDraft, ...drafts]);
    return Promise.resolve(newDraft);
  },
  deleteDraft: (id: number) => {
    const drafts = mockDB.get('ai_drafts') || [];
    mockDB.set('ai_drafts', drafts.filter((d: any) => d.id !== id));
    return Promise.resolve(true);
  },

  // Staff, Executions, Audiences, etc.
  getStaff: () => Promise.resolve(mockDB.get('staff') || []),
  addStaff: (data: any) => {
    const staff = mockDB.get('staff') || [];
    const newMember = {...data, id: Date.now()};
    mockDB.set('staff', [...staff, newMember]);
    return Promise.resolve(newMember);
  },
  getExecutions: () => Promise.resolve(mockDB.get('executions') || []),
  addExecution: (data: any) => {
    const execs = mockDB.get('executions') || [];
    const newExec = {...data, id: Date.now(), date: new Date().toISOString()};
    mockDB.set('executions', [...execs, newExec]);
    return Promise.resolve(newExec);
  },
  getAudiences: () => handleFetch(`${API_BASE_URL}/audiences`, {}, 'audiences'),
  addAudience: (data: any) => {
     const auds = mockDB.get('audiences') || [];
     const newAud = {...data, id: Date.now()};
     mockDB.set('audiences', [...auds, newAud]);
     return Promise.resolve(newAud);
  },
  deleteAudience: (id: string) => {
     const auds = mockDB.get('audiences') || [];
     mockDB.set('audiences', auds.filter((a: any) => a.id.toString() !== id));
     return Promise.resolve(true);
  },
  getMails: () => Promise.resolve(mockDB.get('mails') || []),
  addMail: (data: any) => {
     const mails = mockDB.get('mails') || [];
     const newMail = {...data, id: Date.now()};
     mockDB.set('mails', [...mails, newMail]);
     return Promise.resolve(newMail);
  },
  deleteMail: (id: string) => {
     const mails = mockDB.get('mails') || [];
     mockDB.set('mails', mails.filter((m: any) => m.id.toString() !== id));
     return Promise.resolve(true);
  },
  getTasks: () => handleFetch(`${API_BASE_URL}/tasks`, {}, 'tasks'),
  addTask: (data: any) => {
    const tasks = mockDB.get('tasks') || [];
    const newTask = {...data, id: Date.now(), status: 'pending'};
    mockDB.set('tasks', [...tasks, newTask]);
    return Promise.resolve(newTask);
  },
  updateTaskStatus: (id: string, status: string) => {
    const tasks = mockDB.get('tasks') || [];
    const updated = tasks.map((t: any) => t.id.toString() === id ? {...t, status} : t);
    mockDB.set('tasks', updated);
    return Promise.resolve(true);
  },
  updateFees: (data: any) => {
     const dossiers = mockDB.get('dossiers') || [];
     const updated = dossiers.map((d: any) => d.id.toString() === data.dossier_id.toString() ? {
       ...d, 
       montant_total: parseFloat(data.montant_total), 
       avance: parseFloat(data.avance),
       taxes: parseFloat(data.taxes),
       reste: (parseFloat(data.montant_total) * 1.1) + parseFloat(data.taxes) - parseFloat(data.avance)
     } : d);
     mockDB.set('dossiers', updated);
     return Promise.resolve(true);
  },
  getSettings: () => Promise.resolve(mockDB.get('cabinet_settings')),
  saveSettings: (data: any) => { mockDB.set('cabinet_settings', data); return Promise.resolve(true); },
  getDocuments: (dossierId?: string) => {
    const docs = mockDB.get('documents') || [];
    if (dossierId) return Promise.resolve(docs.filter((d: any) => d.dossier_id.toString() === dossierId.toString()));
    return Promise.resolve(docs);
  },
  addDocument: (data: any) => {
    const docs = mockDB.get('documents') || [];
    const newDoc = { ...data, id: Date.now() };
    mockDB.set('documents', [...docs, newDoc]);
    return Promise.resolve(newDoc);
  },
  deleteDocument: (id: string) => {
    const docs = mockDB.get('documents') || [];
    mockDB.set('documents', docs.filter((d: any) => d.id.toString() !== id.toString()));
    return Promise.resolve(true);
  },
};
