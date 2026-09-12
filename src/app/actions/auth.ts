"use server";

import { usersStore } from '@/lib/store/users';
import { createSession, deleteSession } from '@/lib/session';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const userId = formData.get('userId') as string;
  const password = formData.get('password') as string;

  if (!userId || !password) {
    return { error: 'Please provide both User ID and Password' };
  }

  const user = await usersStore.findByUsername(userId);

  if (!user || !user.active) {
    return { error: 'Invalid credentials' };
  }

  const isMatch = bcrypt.compareSync(password, user.passwordHash);

  if (!isMatch) {
    return { error: 'Invalid credentials' };
  }

  await createSession({
    userId: user.id,
    role: user.role,
    clientId: user.clientId || null
  });

  if (user.role === 'ADMIN') {
    redirect('/admin');
  } else {
    redirect('/dashboard');
  }
}

export async function logout() {
  await deleteSession();
  redirect('/login');
}
