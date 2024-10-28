export type UserRole = 'admin' | 'user';

export interface UserProfile {
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}