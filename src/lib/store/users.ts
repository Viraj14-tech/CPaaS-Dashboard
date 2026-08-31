import fs from 'fs';
import path from 'path';
import { safeWriteJson } from './utils';

const DATA_FILE = path.join(process.cwd(), 'data/users.json');

export interface User {
  id: string;
  username: string;
  passwordHash: string;
  role: 'ADMIN' | 'CLIENT';
  clientId: string | null;
  active: boolean;
}

export const usersStore = {
  getAll: (): User[] => {
    try {
      if (!fs.existsSync(DATA_FILE)) return [];
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading users', error);
      return [];
    }
  },
  
  findByUsername: (username: string): User | undefined => {
    return usersStore.getAll().find(u => u.username === username);
  },

  findById: (id: string): User | undefined => {
    return usersStore.getAll().find(u => u.id === id);
  },

  findByClientId: (clientId: string): User | undefined => {
    return usersStore.getAll().find(u => u.clientId === clientId);
  },

  saveAll: (users: User[]) => {
    safeWriteJson(DATA_FILE, users);
  },

  create: (user: User) => {
    const users = usersStore.getAll();
    users.push(user);
    usersStore.saveAll(users);
    return user;
  },

  update: (id: string, updates: Partial<User>) => {
    const users = usersStore.getAll();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;
    
    users[index] = { ...users[index], ...updates };
    usersStore.saveAll(users);
    return users[index];
  },

  delete: (id: string) => {
    let users = usersStore.getAll();
    users = users.filter(u => u.id !== id);
    usersStore.saveAll(users);
  }
};
