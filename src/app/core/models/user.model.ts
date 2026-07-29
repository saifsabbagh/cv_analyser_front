export interface User {
  id: number;
  name: string;
  email: string;
  role: 'CANDIDATE' | 'ADMIN';
  isActive: boolean;
  createdAt: string;
  avatarUrl?: string | null;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
