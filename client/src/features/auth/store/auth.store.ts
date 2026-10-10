export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

export const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: null,
};
