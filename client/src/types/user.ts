export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthResponse {
  status: string;
  token: string;
  data: { user: User };
}
