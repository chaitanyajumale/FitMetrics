import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { getJwtSecret } from '@/lib/jwt-config';

export { createAuthCookie, clearAuthCookie } from '@/lib/auth-cookie';

export interface JWTPayload {
  userId: string;
  email: string;
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, getJwtSecret()) as JWTPayload;
}

export function getUserFromRequest(request: NextRequest): JWTPayload | null {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}
