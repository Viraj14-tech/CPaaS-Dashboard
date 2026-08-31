"use server";

import { getSession } from "@/lib/session";
import { clientsStore } from "@/lib/store/clients";
import { usersStore } from "@/lib/store/users";
import { ClientSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";
import bcrypt from 'bcryptjs';

export async function addClient(formData: FormData) {
  const session = await getSession();
  if (session?.role !== 'ADMIN') return { error: 'Unauthorized' };

  const data = Object.fromEntries(formData.entries());
  
  const validation = ClientSchema.safeParse(data);
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  const { username, password, ...clientData } = validation.data;

  if (!username || !password) {
    return { error: 'Username and password are required for new clients' };
  }

  const existingUser = usersStore.findByUsername(username);
  if (existingUser) {
    return { error: 'Username already exists' };
  }

  const clientId = `client_${Date.now()}`;

  const client = clientsStore.create({
    id: clientId,
    ...clientData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);

  usersStore.create({
    id: `user_${Date.now()}`,
    username,
    passwordHash,
    role: 'CLIENT',
    clientId,
    active: clientData.status === 'active'
  });

  revalidatePath('/admin');
  
  return { success: true, client };
}

export async function updateClient(id: string, formData: FormData) {
  const session = await getSession();
  if (session?.role !== 'ADMIN') return { error: 'Unauthorized' };

  const existing = clientsStore.findById(id);
  if (!existing) return { error: 'Not found' };

  const data = Object.fromEntries(formData.entries());
  
  const validation = ClientSchema.safeParse(data);
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  const { username, password, ...clientData } = validation.data;

  const updated = clientsStore.update(id, clientData);

  // Update corresponding user
  const user = usersStore.findByClientId(id);
  if (user) {
    const userUpdates: any = { active: clientData.status === 'active' };
    
    if (username && username !== user.username) {
      if (usersStore.findByUsername(username)) {
        return { error: 'Username already exists' };
      }
      userUpdates.username = username;
    }

    if (password) {
      const salt = bcrypt.genSaltSync(10);
      userUpdates.passwordHash = bcrypt.hashSync(password, salt);
    }

    usersStore.update(user.id, userUpdates);
  }

  revalidatePath('/admin');
  revalidatePath(`/admin/clients/${id}`);
  
  return { success: true, client: updated };
}
