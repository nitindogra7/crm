'use client';

import { useState } from 'react';
import { SignupFormData, SignupFormErrors, validateSignup } from '../schemas/signup.schema';
import { authService } from '../services/auth.service';

export function useSignup() {
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<SignupFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleChange = (field: keyof SignupFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateSignup(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      await authService.register(formData);
      // Can redirect or show success notification
    } catch (err) {
      console.error('Signup failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    await authService.loginWithGoogle();
  };

  return {
    formData,
    errors,
    isLoading,
    isPasswordVisible,
    handleChange,
    togglePasswordVisibility,
    handleSubmit,
    handleGoogleSignup,
  };
}
