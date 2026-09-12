import { supabase } from '../supabase';

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
  getAll: async (): Promise<Client[]> => {
    const { data, error } = await supabase.from('clients').select('*');
    if (error) {
      console.error('Error reading clients', error);
      return [];
    }
    return data as Client[];
  },

  findById: async (id: string): Promise<Client | undefined> => {
    const { data, error } = await supabase.from('clients').select('*').eq('id', id).single();
    if (error) return undefined;
    return data as Client;
  },

  create: async (client: Client): Promise<Client> => {
    const { data, error } = await supabase.from('clients').insert([client]).select().single();
    if (error) throw error;
    return data as Client;
  },

  update: async (id: string, updates: Partial<Client>): Promise<Client | null> => {
    const { data, error } = await supabase
      .from('clients')
      .update({ ...updates, updatedAt: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) return null;
    return data as Client;
  },

  delete: async (id: string): Promise<void> => {
    await supabase.from('clients').delete().eq('id', id);
  }
};
