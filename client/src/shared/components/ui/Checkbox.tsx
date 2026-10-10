import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode;
}

export function Checkbox({ label, className = '', ...props }: CheckboxProps) {
  return (
    <label className={`flex items-center gap-2 cursor-pointer ${className}`}>
      <input
        type="checkbox"
        className="w-4 h-4 rounded-sm border-[#333333] bg-[#1A1A1A] checked:bg-white checked:border-white accent-white cursor-pointer"
        {...props}
      />
      <span className="text-sm text-gray-400">
        {label}
      </span>
    </label>
  );
}
