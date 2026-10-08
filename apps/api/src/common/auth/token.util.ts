import * as crypto from 'crypto';
import { UserRole } from '@eotc/contracts';

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  exp: number;
}

export class TokenUtil {
  private static getSecret(): string {
    return process.env.AUTH_SECRET || process.env.SESSION_SECRET || 'eotc-platform-default-fallback-secret-key-32-chars';
  }

  static signToken(payload: Omit<TokenPayload, 'exp'>, expiresInSeconds = 86400): string {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
    const fullPayload: TokenPayload = { ...payload, exp };
    const encodedPayload = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');

    const signature = crypto
      .createHmac('sha256', this.getSecret())
      .update(`${header}.${encodedPayload}`)
      .digest('base64url');

    return `${header}.${encodedPayload}.${signature}`;
  }

  static verifyToken(token: string): TokenPayload | null {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, encodedPayload, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', this.getSecret())
      .update(`${header}.${encodedPayload}`)
      .digest('base64url');

    if (signature !== expectedSignature) {
      return null;
    }

    try {
      const payloadJson = Buffer.from(encodedPayload, 'base64url').toString('utf-8');
      const payload: TokenPayload = JSON.parse(payloadJson);

      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        return null; // Expired
      }

      return payload;
    } catch {
      return null;
    }
  }
}
