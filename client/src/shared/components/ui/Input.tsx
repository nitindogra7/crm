import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export function Input({ className = '', icon, ...props }: InputProps) {
  return (
    <div className="relative w-full">
      <input
        className={`w-full bg-[#1A1A1A] text-white border border-[#333333] rounded-md px-4 py-3 outline-none focus:border-white transition-colors placeholder:text-gray-500 ${className}`}
        {...props}
      />
      {icon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
    </div>
  );
}
