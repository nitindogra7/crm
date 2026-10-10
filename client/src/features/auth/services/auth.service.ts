import { SignupFormData } from '../schemas/signup.schema';

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export const authService = {
  async register(data: SignupFormData): Promise<AuthResponse> {
    // API client / authentication call
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      success: true,
      user: {
        id: 'usr_1',
        email: data.email,
        name: `${data.firstName} ${data.lastName}`.trim(),
      },
    };
  },

  async loginWithGoogle(): Promise<void> {
    // Redirect to Google OAuth endpoint
    console.log('Initiating Google OAuth flow...');
  },
};
