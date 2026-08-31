import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from './lib/session';

const protectedRoutes = ['/dashboard', '/whatsapp'];
const adminRoutes = ['/admin'];
const publicRoutes = ['/login', '/admin/login'];

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some(r => path.startsWith(r));
  const isAdminRoute = adminRoutes.some(r => path.startsWith(r) && !publicRoutes.includes(path));
  const isPublicRoute = publicRoutes.includes(path);

  const session = await getSession();

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }
  
  if (isProtectedRoute && session?.role === 'ADMIN') {
    // Admins shouldn't be on client dashboard without context, redirect to admin
    return NextResponse.redirect(new URL('/admin', request.nextUrl));
  }

  if (isAdminRoute && session?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  if (isPublicRoute && session?.role === 'CLIENT') {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
  }
  
  if (isPublicRoute && session?.role === 'ADMIN') {
    return NextResponse.redirect(new URL('/admin', request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
