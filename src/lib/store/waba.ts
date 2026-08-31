import fs from 'fs';
import path from 'path';
import { safeWriteJson } from './utils';

const DATA_FILE = path.join(process.cwd(), 'data/waba.json');

export interface Waba {
  id: string;
  clientId: string;
  displayName: string;
  mobileNumber: string;
  createdOn: string;
  expiryDate: string;
  verificationStatus: string;
  phoneStatus: string;
  quality: string;
  messagingLimit: string;
  businessName: string;
  businessId: string;
  wabaAccountId: string;
  phoneNumberId: string;
  insights: string;
}

export const wabaStore = {
  getAll: (): Waba[] => {
    try {
      if (!fs.existsSync(DATA_FILE)) return [];
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading waba', error);
      return [];
    }
  },
  
  findByClientId: (clientId: string): Waba[] => {
    return wabaStore.getAll().find(w => w.clientId === clientId) ? wabaStore.getAll().filter(w => w.clientId === clientId) : [];
  },

  findById: (id: string): Waba | undefined => {
    return wabaStore.getAll().find(w => w.id === id);
  },

  saveAll: (wabas: Waba[]) => {
    safeWriteJson(DATA_FILE, wabas);
  },

  create: (waba: Waba) => {
    const wabas = wabaStore.getAll();
    wabas.push(waba);
    wabaStore.saveAll(wabas);
    return waba;
  },

  update: (id: string, updates: Partial<Waba>) => {
    const wabas = wabaStore.getAll();
    const index = wabas.findIndex(w => w.id === id);
    if (index === -1) return null;
    
    wabas[index] = { ...wabas[index], ...updates };
    wabaStore.saveAll(wabas);
    return wabas[index];
  },

  delete: (id: string) => {
    let wabas = wabaStore.getAll();
    wabas = wabas.filter(w => w.id !== id);
    wabaStore.saveAll(wabas);
  }
};
