
const API_BASE_URL = 'http://localhost:3001/api';

// نظام التخزين المحلي الاحتياطي في حال فشل السيرفر
const mockStorage = {
  get: (key: string) => {
    const data = localStorage.getItem(`mock_${key}`);
    return data ? JSON.parse(data) : [];
  },
  set: (key: string, data: any) => {
    const existing = mockStorage.get(key);
    const newItem = { ...data, id: Date.now() };
    const updated = [...existing, newItem];
    localStorage.setItem(`mock_${key}`, JSON.stringify(updated));
    return { id: newItem.id, message: 'تم الحفظ في الذاكرة المحلية (Offline Mode)' };
  },
  updateFees: (data: any) => {
    const dossiers = mockStorage.get('dossiers');
    const updated = dossiers.map((d: any) => 
      d.id == data.dossier_id ? { ...d, montant_total: data.montant_total, avance: data.avance, reste: (data.montant_total - data.avance) } : d
    );
    localStorage.setItem('mock_dossiers', JSON.stringify(updated));
    return { success: true };
  },
  updateStatus: (id: number, status: string) => {
    const dossiers = mockStorage.get('dossiers');
    const updated = dossiers.map((d: any) => 
      d.id == id ? { ...d, statut: status } : d
    );
    localStorage.setItem('mock_dossiers', JSON.stringify(updated));
    return { success: true };
  }
};

const handleFetch = async (url: string, options?: RequestInit, mockKey?: string) => {
  try {
    const response = await fetch(url, {
      ...options,
      signal: (AbortSignal as any).timeout(3000)
    });
    if (!response.ok) throw new Error('Backend Error');
    return await response.json();
  } catch (error) {
    console.warn(`Connection Failed to ${url}. Switching to Mock Data`);
    
    if (options?.method === 'POST' && mockKey) {
      const body = JSON.parse(options.body as string);
      if (mockKey === 'honoraires') return mockStorage.updateFees(body);
      return mockStorage.set(mockKey, body);
    }

    if (options?.method === 'PATCH' && mockKey === 'dossiers_status') {
      const body = JSON.parse(options.body as string);
      const id = parseInt(url.split('/').slice(-2, -1)[0]);
      return mockStorage.updateStatus(id, body.status);
    }
    
    if (mockKey === 'clients' || mockKey === 'dossiers' || mockKey === 'audiences') {
        return mockStorage.get(mockKey);
    }
    
    return [];
  }
};

export const api = {
  checkConnection: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/clients`, { method: 'HEAD' });
      return res.ok;
    } catch {
      return false;
    }
  },
  getClients: () => handleFetch(`${API_BASE_URL}/clients`, undefined, 'clients'),
  addClient: (data: any) => handleFetch(`${API_BASE_URL}/clients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }, 'clients'),
  getDossiers: () => handleFetch(`${API_BASE_URL}/dossiers`, undefined, 'dossiers'),
  addDossier: (data: any) => handleFetch(`${API_BASE_URL}/dossiers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }, 'dossiers'),
  updateDossierStatus: (id: number, status: string) => handleFetch(`${API_BASE_URL}/dossiers/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  }, 'dossiers_status'),
  getAudiences: () => handleFetch(`${API_BASE_URL}/audiences`, undefined, 'audiences'),
  addAudience: (data: any) => handleFetch(`${API_BASE_URL}/audiences`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }, 'audiences'),
  updateFees: (data: any) => handleFetch(`${API_BASE_URL}/honoraires`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }, 'honoraires'),
};
