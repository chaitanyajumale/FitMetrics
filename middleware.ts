import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose/jwt/verify';
import { getJwtSecret } from '@/lib/jwt-config';
import { clearAuthCookie } from '@/lib/auth-cookie';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  let tokenValid = false;
  if (token) {
    try {
      await jwtVerify(token, new TextEncoder().encode(getJwtSecret()), {
        algorithms: ['HS256'],
      });
      tokenValid = true;
    } catch {
      tokenValid = false;
    }
  }

  const publicRoutes = ['/', '/login', '/register'];
  const isPublicRoute = publicRoutes.includes(pathname);

  if (!tokenValid && !isPublicRoute && pathname.startsWith('/dashboard')) {
    const res = NextResponse.redirect(new URL('/login', request.url));
    if (token) {
      res.cookies.set(clearAuthCookie());
    }
    return res;
  }

  if (tokenValid && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (token && !tokenValid && (pathname === '/login' || pathname === '/register')) {
    const res = NextResponse.next();
    res.cookies.set(clearAuthCookie());
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
