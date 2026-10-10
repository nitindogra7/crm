"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Pill, Button } from "@/features/marketing/components/ui";
import { Icon } from "@/features/marketing/components/icons";
import { useSignup } from "../hooks/use-signup";

const EyeIcon = ({ isVisible }: { isVisible: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-[#777] hover:text-white transition-colors"
  >
    {isVisible ? (
      <>
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
        <line x1="2" x2="22" y1="2" y2="22" />
      </>
    ) : (
      <>
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    )}
  </svg>
);

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

export function SignupForm() {
  const searchParams = useSearchParams();
  const plan = searchParams?.get("plan");

  const {
    formData,
    errors,
    isLoading,
    isPasswordVisible,
    handleChange,
    togglePasswordVisibility,
    handleSubmit,
    handleGoogleSignup,
  } = useSignup();

  const planLabel =
    plan === "pro"
      ? "Pro plan selected · 14-day free trial"
      : plan === "studio"
      ? "Studio plan selected · Priority support"
      : "The zero-backend form solution · Free tier";

  return (
    <div className="flex-1 flex flex-col justify-center px-4 py-5 md:px-8 lg:px-6 xl:px-10 max-w-[480px] mx-auto w-full h-full">
      {/* Mobile Top Brand (visible on small screens when side banner is hidden) */}
      <div className="flex lg:hidden items-center justify-between mb-6 pb-3 border-b border-white/[0.08]">
        <Link href="/" className="flex items-center gap-2 text-white">
          <span className="w-6 h-6 rounded-full bg-[radial-gradient(circle_at_32%_26%,#555,#0a0a0a)] border border-[#3a3a3a] inline-grid place-items-center flex-none">
            <Icon name="logo" className="w-3 h-3 text-white" />
          </span>
          <span className="font-medium text-sm">Salenova</span>
        </Link>
        <Link
          href="/"
          className="text-[11px] text-[#8c8c8c] hover:text-white transition-colors flex items-center gap-1"
        >
          <span>←</span> Back to home
        </Link>
      </div>

      {/* Pill Badge */}
      <div className="inline-block mb-2 xl:mb-2.5">
        <Pill icon="bolt">{planLabel}</Pill>
      </div>

      {/* Headline & Description */}
      <h1 className="text-[25px] sm:text-[28px] xl:text-[32px] font-extralight tracking-[-0.04em] leading-[1.12] text-white mb-1">
        Start capturing leads <br className="hidden sm:block" />
        <span className="text-[#7a7a7a]">in sixty seconds.</span>
      </h1>
      {/* Spacing preserved */}
      <div className="h-7 sm:h-8 xl:h-9" aria-hidden="true" />

      {/* Google OAuth Button */}
      <button
        type="button"
        onClick={handleGoogleSignup}
        className="w-full flex items-center justify-center gap-2.5 py-2 px-3.5 rounded-[9px] border border-white/[0.14] bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/30 text-white text-[12px] font-normal shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-all cursor-pointer active:scale-[0.99] select-none"
      >
        <GoogleIcon />
        <span>Continue with Google</span>
      </button>

      {/* Or Divider */}
      <div className="flex items-center gap-3 my-2.5 xl:my-3">
        <span className="flex-1 h-px bg-white/[0.08]" />
        <span className="text-[10px] uppercase tracking-wider text-[#555] font-medium">
          Or continue with email
        </span>
        <span className="flex-1 h-px bg-white/[0.08]" />
      </div>

      {/* Signup Form */}
      <form onSubmit={handleSubmit} className="space-y-2.5 xl:space-y-3">
        {/* Name Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[10.5px] font-medium text-[#8c8c8c] mb-1">
              First name
            </label>
            <input
              type="text"
              placeholder="Alex"
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              className="w-full bg-[#121214] text-white border border-white/[0.12] rounded-[8px] px-3 py-1.5 xl:py-2 text-[12.5px] placeholder:text-[#555] outline-none transition-all focus:border-white/40 focus:ring-1 focus:ring-white/20 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]"
            />
            {errors.firstName && (
              <p className="text-[10px] text-red-400 mt-0.5">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label className="block text-[10.5px] font-medium text-[#8c8c8c] mb-1">
              Last name
            </label>
            <input
              type="text"
              placeholder="Chen"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              className="w-full bg-[#121214] text-white border border-white/[0.12] rounded-[8px] px-3 py-1.5 xl:py-2 text-[12.5px] placeholder:text-[#555] outline-none transition-all focus:border-white/40 focus:ring-1 focus:ring-white/20 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]"
            />
            {errors.lastName && (
              <p className="text-[10px] text-red-400 mt-0.5">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-[10.5px] font-medium text-[#8c8c8c] mb-1">
            Work email
          </label>
          <input
            type="email"
            placeholder="alex@company.com"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full bg-[#121214] text-white border border-white/[0.12] rounded-[8px] px-3 py-1.5 xl:py-2 text-[12.5px] placeholder:text-[#555] outline-none transition-all focus:border-white/40 focus:ring-1 focus:ring-white/20 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]"
          />
          {errors.email && (
            <p className="text-[10px] text-red-400 mt-0.5">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-[10.5px] font-medium text-[#8c8c8c] mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={isPasswordVisible ? "text" : "password"}
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className="w-full bg-[#121214] text-white border border-white/[0.12] rounded-[8px] px-3 py-1.5 xl:py-2 pr-9 text-[12.5px] placeholder:text-[#555] outline-none transition-all focus:border-white/40 focus:ring-1 focus:ring-white/20 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              aria-label="Toggle password visibility"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer p-1"
            >
              <EyeIcon isVisible={isPasswordVisible} />
            </button>
          </div>
          {errors.password && (
            <p className="text-[10px] text-red-400 mt-0.5">{errors.password}</p>
          )}
        </div>

        {/* Terms Checkbox */}
        <div className="pt-0.5">
          <label className="flex items-start gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={(e) => handleChange("agreeToTerms", e.target.checked)}
              className="mt-0.5 w-3.5 h-3.5 rounded border border-white/20 bg-[#121214] checked:bg-white checked:border-white accent-white cursor-pointer"
            />
            <span className="text-[11.5px] text-[#8c8c8c] leading-tight">
              I agree to the{" "}
              <Link href="#" className="text-white hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-white hover:underline">
                Privacy Policy
              </Link>
            </span>
          </label>
          {errors.agreeToTerms && (
            <p className="text-[10px] text-red-400 mt-0.5">{errors.agreeToTerms}</p>
          )}
        </div>

        {/* Submit Solid Button */}
        <div className="pt-1">
          <Button
            type="submit"
            variant="solid"
            disabled={isLoading}
            className="w-full py-[9px] xl:py-[10px] text-[12.5px] font-medium"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Creating your account...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                Create account
                <Icon name="arrow" className="w-3.5 h-3.5" />
              </span>
            )}
          </Button>
        </div>
      </form>

      {/* Footer: Sign in link */}
      <p className="text-center text-[11.5px] text-[#777] mt-2.5 xl:mt-3">
        Already have an account?{" "}
        <Link href="/login" className="text-white hover:underline font-normal">
          Log in
        </Link>
      </p>

      {/* Security trust badges */}
      <div className="flex items-center justify-center gap-4 mt-3 xl:mt-4 pt-2.5 xl:pt-3 border-t border-white/[0.06] text-[10px] text-[#555]">
        <span className="flex items-center gap-1.5">
          <Icon name="lock" className="w-3 h-3 text-[#777]" /> SSL Encrypted
        </span>
        <span className="flex items-center gap-1.5">
          <Icon name="shield" className="w-3 h-3 text-[#777]" /> Spam Shielded
        </span>
        <span className="flex items-center gap-1.5">
          <Icon name="bolt" className="w-3 h-3 text-[#777]" /> Zero Setup
        </span>
      </div>
    </div>
  );
}
