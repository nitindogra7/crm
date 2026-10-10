export interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  agreeToTerms: boolean;
}

export type SignupFormErrors = Partial<Record<keyof SignupFormData, string>>;

export function validateSignup(data: SignupFormData): SignupFormErrors {
  const errors: SignupFormErrors = {};

  if (!data.firstName.trim()) {
    errors.firstName = 'First name is required';
  }

  if (!data.lastName.trim()) {
    errors.lastName = 'Last name is required';
  }

  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  } else if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (!data.agreeToTerms) {
    errors.agreeToTerms = 'You must agree to the Terms & Conditions';
  }

  return errors;
}
