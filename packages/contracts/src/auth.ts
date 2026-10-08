import { UserRole } from './enums';

export interface ChurchScopeDto {
  churchId: string;
  churchSlug: string;
  role: UserRole;
  status: string;
}

export interface UserDto {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  status: string;
  emailVerifiedAt?: string | null;
  lastLoginAt?: string | null;
  createdAt: string;
  churchMemberships?: ChurchScopeDto[];
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  displayName: string;
  password: string;
}

export interface AuthSessionDto {
  user: UserDto;
  token?: string; // Delivered via HttpOnly cookie or bearer for API clients
  expiresAt: string;
}
