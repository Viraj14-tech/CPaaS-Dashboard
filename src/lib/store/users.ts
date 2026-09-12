import { supabase } from '../supabase';

export interface User {
  id: string;
  username: string;
  passwordHash: string;
  role: 'ADMIN' | 'CLIENT';
  clientId?: string;
  active: boolean;
}

export const usersStore = {
  getAll: async (): Promise<User[]> => {
    const { data, error } = await supabase.from('users').select('*');
    if (error) {
      console.error('Error reading users', error);
      return [];
    }
    return data as User[];
  },

  findByUsername: async (username: string): Promise<User | undefined> => {
    const { data, error } = await supabase.from('users').select('*').eq('username', username).single();
    if (error) return undefined;
    return data as User;
  },

  findById: async (id: string): Promise<User | undefined> => {
    const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
    if (error) return undefined;
    return data as User;
  },

  findByClientId: async (clientId: string): Promise<User | undefined> => {
    const { data, error } = await supabase.from('users').select('*').eq('clientId', clientId).single();
    if (error) return undefined;
    return data as User;
  },

  create: async (user: User): Promise<User> => {
    const { data, error } = await supabase.from('users').insert([user]).select().single();
    if (error) throw error;
    return data as User;
  },

  update: async (id: string, updates: Partial<User>): Promise<User | null> => {
    const { data, error } = await supabase.from('users').update(updates).eq('id', id).select().single();
    if (error) return null;
    return data as User;
  },

  delete: async (id: string): Promise<void> => {
    await supabase.from('users').delete().eq('id', id);
  }
};
