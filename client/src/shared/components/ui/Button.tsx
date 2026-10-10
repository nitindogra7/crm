import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  const baseClasses = 'w-full rounded-md px-4 py-3 font-medium transition-colors flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-white text-black hover:bg-gray-200',
    outline: 'bg-transparent text-white border border-[#333333] hover:bg-[#1A1A1A]',
    ghost: 'bg-transparent text-white hover:bg-[#1A1A1A]',
  };

  return (
    <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
