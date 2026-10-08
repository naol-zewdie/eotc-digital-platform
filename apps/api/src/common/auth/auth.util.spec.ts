import { PasswordUtil } from './password.util';
import { TokenUtil } from './token.util';
import { UserRole } from '@eotc/contracts';

describe('Auth Utilities', () => {
  describe('PasswordUtil', () => {
    it('should hash and verify passwords correctly', () => {
      const password = 'SecretPassword!2026';
      const hash = PasswordUtil.hashPassword(password);

      expect(hash).toMatch(/^scrypt:/);
      expect(PasswordUtil.verifyPassword(password, hash)).toBe(true);
      expect(PasswordUtil.verifyPassword('WrongPassword', hash)).toBe(false);
    });

    it('should recognize dev dummy seed password', () => {
      const seedHash = '$argon2id$v=19$m=65536,t=3,p=4$dummyhashforseed$samplehash';
      expect(PasswordUtil.verifyPassword('Admin@123456', seedHash)).toBe(true);
      expect(PasswordUtil.verifyPassword('WrongAdminPassword', seedHash)).toBe(false);
    });
  });

  describe('TokenUtil', () => {
    it('should sign and verify valid session tokens', () => {
      const payload = {
        userId: 'usr-1234',
        email: 'test@eotc-platform.org',
        role: UserRole.ADMINISTRATOR,
      };

      const token = TokenUtil.signToken(payload, 3600);
      expect(token).toBeDefined();

      const decoded = TokenUtil.verifyToken(token);
      expect(decoded).not.toBeNull();
      expect(decoded?.userId).toBe(payload.userId);
      expect(decoded?.email).toBe(payload.email);
      expect(decoded?.role).toBe(payload.role);
    });

    it('should reject tampered or invalid tokens', () => {
      const token = TokenUtil.signToken(
        { userId: 'usr-1', email: 'test@eotc.org', role: UserRole.REGISTERED_USER },
        3600,
      );
      const tampered = token.slice(0, -5) + 'xxxxx';
      expect(TokenUtil.verifyToken(tampered)).toBeNull();
      expect(TokenUtil.verifyToken('malformed-token')).toBeNull();
    });
  });
});
