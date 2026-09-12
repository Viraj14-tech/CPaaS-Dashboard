import { supabase } from '../supabase';

export interface Campaign {
  id: string;
  clientId: string;
  campaignName: string;
  campaignDate: string;
  templateName: string;
  category: string;
  templateType: string;
  status: string;
  totalAudience: number;
  sent: number;
  delivered: number;
  failed: number;
  read: number;
  amountSpent: number;
  createdAt: string;
  updatedAt: string;
}

export const campaignsStore = {
  getAll: async (): Promise<Campaign[]> => {
    const { data, error } = await supabase.from('campaigns').select('*');
    if (error) {
      console.error('Error reading campaigns', error);
      return [];
    }
    return data as Campaign[];
  },
  
  findByClientId: async (clientId: string): Promise<Campaign[]> => {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('clientId', clientId)
      .order('campaignDate', { ascending: false });
      
    if (error) return [];
    return data as Campaign[];
  },

  findById: async (id: string): Promise<Campaign | undefined> => {
    const { data, error } = await supabase.from('campaigns').select('*').eq('id', id).single();
    if (error) return undefined;
    return data as Campaign;
  },

  create: async (campaign: Campaign): Promise<Campaign> => {
    const { data, error } = await supabase.from('campaigns').insert([campaign]).select().single();
    if (error) throw error;
    return data as Campaign;
  },

  bulkCreate: async (newCampaigns: Campaign[]): Promise<Campaign[]> => {
    const { data, error } = await supabase.from('campaigns').insert(newCampaigns).select();
    if (error) throw error;
    return data as Campaign[];
  },

  update: async (id: string, updates: Partial<Campaign>): Promise<Campaign | null> => {
    const { data, error } = await supabase
      .from('campaigns')
      .update({ ...updates, updatedAt: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
      
    if (error) return null;
    return data as Campaign;
  },

  delete: async (id: string): Promise<void> => {
    await supabase.from('campaigns').delete().eq('id', id);
  }
};
