import fs from 'fs';
import path from 'path';
import { safeWriteJson } from './utils';

const DATA_FILE = path.join(process.cwd(), 'data/clients.json');

export interface Client {
  id: string;
  name: string;
  displayName: string;
  contactPerson: string;
  phone: string;
  email: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const clientsStore = {
  getAll: (): Client[] => {
    try {
      if (!fs.existsSync(DATA_FILE)) return [];
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading clients', error);
      return [];
    }
  },
  
  findById: (id: string): Client | undefined => {
    return clientsStore.getAll().find(c => c.id === id);
  },

  saveAll: (clients: Client[]) => {
    safeWriteJson(DATA_FILE, clients);
  },

  create: (client: Client) => {
    const clients = clientsStore.getAll();
    clients.push(client);
    clientsStore.saveAll(clients);
    return client;
  },

  update: (id: string, updates: Partial<Client>) => {
    const clients = clientsStore.getAll();
    const index = clients.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    clients[index] = { ...clients[index], ...updates, updatedAt: new Date().toISOString() };
    clientsStore.saveAll(clients);
    return clients[index];
  },

  delete: (id: string) => {
    let clients = clientsStore.getAll();
    clients = clients.filter(c => c.id !== id);
    clientsStore.saveAll(clients);
  }
};
