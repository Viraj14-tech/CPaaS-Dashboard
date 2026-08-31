"use server";

import { getSession } from "@/lib/session";
import { campaignsStore } from "@/lib/store/campaigns";
import { CampaignSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export async function addCampaign(clientId: string, formData: FormData) {
  const session = await getSession();
  if (session?.role !== 'ADMIN') return { error: 'Unauthorized' };

  const data = Object.fromEntries(formData.entries());
  
  const validation = CampaignSchema.safeParse(data);
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  const campaign = campaignsStore.create({
    id: `camp_${Date.now()}`,
    clientId,
    ...validation.data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath('/dashboard');
  revalidatePath('/whatsapp/report');
  
  return { success: true, campaign };
}

export async function updateCampaign(id: string, formData: FormData) {
  const session = await getSession();
  if (session?.role !== 'ADMIN') return { error: 'Unauthorized' };

  const existing = campaignsStore.findById(id);
  if (!existing) return { error: 'Not found' };

  const data = Object.fromEntries(formData.entries());
  
  const validation = CampaignSchema.safeParse(data);
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  const updated = campaignsStore.update(id, validation.data);

  revalidatePath(`/admin/clients/${existing.clientId}`);
  revalidatePath('/dashboard');
  revalidatePath('/whatsapp/report');
  
  return { success: true, campaign: updated };
}

export async function deleteCampaign(id: string) {
  const session = await getSession();
  if (session?.role !== 'ADMIN') return { error: 'Unauthorized' };

  const existing = campaignsStore.findById(id);
  if (!existing) return { error: 'Not found' };

  campaignsStore.delete(id);

  revalidatePath(`/admin/clients/${existing.clientId}`);
  revalidatePath('/dashboard');
  revalidatePath('/whatsapp/report');
  
  return { success: true };
}
