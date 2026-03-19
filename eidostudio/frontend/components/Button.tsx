import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'solid' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-full disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none';

  const variants = {
    primary:
      'bg-brand-primary text-white hover:bg-brand-primary-dark shadow-md hover:shadow-lg focus:ring-2 focus:ring-brand-primary/50',
    secondary:
      'bg-brand-neutral text-white hover:bg-brand-neutral-light shadow-sm focus:ring-2 focus:ring-brand-neutral/50',
    outline:
      'border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white focus:ring-2 focus:ring-brand-primary/50',
    solid:
      'bg-brand-neutral text-white hover:bg-black focus:bg-black active:bg-black focus:text-white active:text-white',
    ghost:
      'border border-white/40 bg-transparent text-white hover:bg-white hover:text-brand-neutral focus:bg-white focus:text-brand-neutral active:bg-white active:text-brand-neutral',
    danger:
      'bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg focus:ring-2 focus:ring-red-500/50',
  };

  const sizes = {
    sm: 'px-4 py-1.5 text-xs',
    md: 'px-8 py-3 text-sm',
    lg: 'px-10 py-4 text-base',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
