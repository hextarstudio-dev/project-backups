import React from 'react';
import { Link } from '../../utils/router-types';

interface ServiceButtonProps {
  to?: string;
  onClick?: () => void;
  text?: string;
  className?: string;
  fullWidth?: boolean;
}

const ServiceButton: React.FC<ServiceButtonProps> = ({
  to = '/orcamento',
  onClick,
  text = 'Saber mais',
  className = '',
  fullWidth = true,
}) => {
  const buttonContent = (
    <button
      onClick={onClick}
      className={`py-3 text-xs font-bold uppercase tracking-wider border-2 bg-gradient-to-r from-brand-primary to-brand-orange text-white border-brand-primary rounded-xl relative overflow-hidden transition-all duration-300 group ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {text}
        <i className="fas fa-arrow-right text-xs opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300"></i>
      </span>
    </button>
  );

  if (to && !onClick) {
    return (
      <Link to={to} className={fullWidth ? 'w-full' : ''}>
        {buttonContent}
      </Link>
    );
  }

  return buttonContent;
};

export default ServiceButton;
