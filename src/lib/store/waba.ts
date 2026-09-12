import { supabase } from '../supabase';

export interface WabaAccount {
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
  getAll: async (): Promise<WabaAccount[]> => {
    const { data, error } = await supabase.from('waba').select('*');
    if (error) {
      console.error('Error reading WABA accounts', error);
      return [];
    }
    return data as WabaAccount[];
  },
  
  findByClientId: async (clientId: string): Promise<WabaAccount[]> => {
    const { data, error } = await supabase.from('waba').select('*').eq('clientId', clientId);
    if (error) return [];
    return data as WabaAccount[];
  },

  findById: async (id: string): Promise<WabaAccount | undefined> => {
    const { data, error } = await supabase.from('waba').select('*').eq('id', id).single();
    if (error) return undefined;
    return data as WabaAccount;
  },

  create: async (waba: WabaAccount): Promise<WabaAccount> => {
    const { data, error } = await supabase.from('waba').insert([waba]).select().single();
    if (error) throw error;
    return data as WabaAccount;
  },

  update: async (id: string, updates: Partial<WabaAccount>): Promise<WabaAccount | null> => {
    const { data, error } = await supabase.from('waba').update(updates).eq('id', id).select().single();
    if (error) return null;
    return data as WabaAccount;
  },

  delete: async (id: string): Promise<void> => {
    await supabase.from('waba').delete().eq('id', id);
  }
};
