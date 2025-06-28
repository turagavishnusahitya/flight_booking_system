import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ProfessionalInputProps {
  id?: string;
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: LucideIcon;
  required?: boolean;
  error?: string;
  className?: string;
}

const ProfessionalInput: React.FC<ProfessionalInputProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  icon: Icon,
  required = false,
  error,
  className = ''
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {Icon && <Icon className="inline w-4 h-4 mr-2 text-gray-500" />}
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`input-professional ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''}`}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
};

export default ProfessionalInput;