import fs from 'fs';
import path from 'path';
import { safeWriteJson } from './utils';

const DATA_FILE = path.join(process.cwd(), 'data/campaigns.json');

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
  getAll: (): Campaign[] => {
    try {
      if (!fs.existsSync(DATA_FILE)) return [];
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading campaigns', error);
      return [];
    }
  },
  
  findByClientId: (clientId: string): Campaign[] => {
    return campaignsStore.getAll()
      .filter(c => c.clientId === clientId)
      .sort((a, b) => new Date(b.campaignDate).getTime() - new Date(a.campaignDate).getTime());
  },

  findById: (id: string): Campaign | undefined => {
    return campaignsStore.getAll().find(c => c.id === id);
  },

  saveAll: (campaigns: Campaign[]) => {
    safeWriteJson(DATA_FILE, campaigns);
  },

  create: (campaign: Campaign) => {
    const campaigns = campaignsStore.getAll();
    campaigns.push(campaign);
    campaignsStore.saveAll(campaigns);
    return campaign;
  },

  update: (id: string, updates: Partial<Campaign>) => {
    const campaigns = campaignsStore.getAll();
    const index = campaigns.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    campaigns[index] = { ...campaigns[index], ...updates, updatedAt: new Date().toISOString() };
    campaignsStore.saveAll(campaigns);
    return campaigns[index];
  },

  delete: (id: string) => {
    let campaigns = campaignsStore.getAll();
    campaigns = campaigns.filter(c => c.id !== id);
    campaignsStore.saveAll(campaigns);
  }
};
