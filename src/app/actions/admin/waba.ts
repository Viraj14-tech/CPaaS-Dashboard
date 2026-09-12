"use server";

import { getSession } from "@/lib/session";
import { wabaStore } from "@/lib/store/waba";
import { WabaSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export async function addWaba(clientId: string, formData: FormData) {
  const session = await getSession();
  if (session?.role !== 'ADMIN') return { error: 'Unauthorized' };

  const data = Object.fromEntries(formData.entries());
  
  const validation = WabaSchema.safeParse(data);
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  const waba = await wabaStore.create({
    id: `waba_${Date.now()}`,
    clientId,
    ...validation.data
  });

  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath('/whatsapp/manage-waba');
  
  return { success: true, waba };
}

export async function updateWaba(id: string, formData: FormData) {
  const session = await getSession();
  if (session?.role !== 'ADMIN') return { error: 'Unauthorized' };

  const existing = await wabaStore.findById(id);
  if (!existing) return { error: 'Not found' };

  const data = Object.fromEntries(formData.entries());
  
  const validation = WabaSchema.safeParse(data);
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  const updated = await wabaStore.update(id, validation.data);

  revalidatePath(`/admin/clients/${existing.clientId}`);
  revalidatePath('/whatsapp/manage-waba');
  
  return { success: true, waba: updated };
}
