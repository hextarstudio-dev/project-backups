import React, { useState, useRef, useEffect } from 'react';

export interface Option {
  value: string;
  label: string;
  icon?: string;
}

interface CustomDropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder = 'Selecione...',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const initialIndex = Math.max(
      0,
      options.findIndex(opt => opt.value === value)
    );
    setFocusedIndex(initialIndex);
    requestAnimationFrame(() => {
      optionRefs.current[initialIndex]?.focus();
    });
  }, [isOpen, options, value]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setFocusedIndex(-1);
    triggerRef.current?.focus();
  };

  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(true);
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
      setFocusedIndex(-1);
    }
  };

  const handleOptionKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      setFocusedIndex(-1);
      triggerRef.current?.focus();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = (idx + 1) % options.length;
      setFocusedIndex(next);
      optionRefs.current[next]?.focus();
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = (idx - 1 + options.length) % options.length;
      setFocusedIndex(prev);
      optionRefs.current[prev]?.focus();
      return;
    }

    if (e.key === 'Home') {
      e.preventDefault();
      setFocusedIndex(0);
      optionRefs.current[0]?.focus();
      return;
    }

    if (e.key === 'End') {
      e.preventDefault();
      const last = options.length - 1;
      setFocusedIndex(last);
      optionRefs.current[last]?.focus();
      return;
    }
  };

  const renderIcon = (iconName: string, isActive: boolean) => {
    const colorClass = isActive
      ? 'text-brand-primary'
      : 'text-brand-gray-300 group-hover:text-brand-gray-500';

    if (iconName.startsWith('fa-')) {
      return <i className={`fas ${iconName} ${colorClass} ml-2 text-sm`} aria-hidden="true"></i>;
    }

    if (iconName.startsWith('shape-')) {
      return (
        <svg
          viewBox="0 0 24 24"
          className={`w-5 h-5 ml-2 ${colorClass}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {iconName === 'shape-portrait' && <rect x="7" y="4" width="10" height="16" rx="1" />}
          {iconName === 'shape-square' && <rect x="5" y="5" width="14" height="14" rx="1" />}
          {iconName === 'shape-landscape' && <rect x="3" y="6" width="18" height="12" rx="1" />}
          {iconName === 'shape-carousel' && (
            <>
              <rect x="5" y="4" width="14" height="16" rx="1" />
              <path d="M20 7v10" />
              <path d="M23 9v6" />
            </>
          )}
        </svg>
      );
    }

    return null;
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="text-sm font-bold text-brand-neutral ml-1 mb-2 block">{label}</label>
      )}

      <button
        type="button"
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleTriggerKeyDown}
        className={`w-full bg-white text-brand-neutral px-4 py-3 rounded-2xl border transition-all cursor-pointer flex justify-between items-center shadow-sm hover:border-brand-primary group ${isOpen ? 'border-brand-primary ring-2 ring-brand-primary/10' : 'border-brand-gray-200'}`}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls="custom-dropdown-listbox"
      >
        <div className="flex items-center gap-2 flex-grow overflow-hidden text-left">
          <span
            className={`whitespace-nowrap truncate ${!selectedOption ? 'text-brand-gray-400' : 'font-medium'}`}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.icon && (
            <div className="ml-auto">{renderIcon(selectedOption.icon, false)}</div>
          )}
        </div>

        <div
          className={`ml-3 w-6 h-6 rounded-full bg-brand-gray-50 flex items-center justify-center transition-all duration-300 group-hover:bg-brand-primary/10 group-hover:text-brand-primary flex-shrink-0 ${isOpen ? 'rotate-180 bg-brand-primary text-white group-hover:bg-brand-primary group-hover:text-white' : 'text-brand-gray-400'}`}
        >
          <i className="fas fa-chevron-down text-[10px]" aria-hidden="true"></i>
        </div>
      </button>

      <div
        className={`absolute z-50 left-0 right-0 mt-2 bg-white rounded-2xl border border-brand-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.1)] overflow-hidden transition-all duration-300 origin-top ${isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'}`}
      >
        <div
          id="custom-dropdown-listbox"
          role="listbox"
          className="max-h-60 overflow-y-auto custom-scrollbar p-2"
        >
          {options.map((option, idx) => (
            <button
              key={option.value}
              type="button"
              ref={el => {
                optionRefs.current[idx] = el;
              }}
              id={`custom-dropdown-option-${idx}`}
              role="option"
              aria-selected={value === option.value}
              onKeyDown={e => handleOptionKeyDown(e, idx)}
              onClick={() => handleSelect(option.value)}
              className={`w-full text-left px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-between mb-1 last:mb-0 group ${value === option.value ? 'bg-brand-primary/5 text-brand-primary font-bold' : 'text-brand-gray-600 hover:bg-brand-gray-50 hover:pl-6'} ${focusedIndex === idx ? 'ring-2 ring-brand-primary/20' : ''}`}
            >
              <div className="flex items-center justify-between w-full mr-2">
                <span className="whitespace-nowrap">{option.label}</span>
                {option.icon && renderIcon(option.icon, value === option.value)}
              </div>

              {value === option.value && (
                <i className="fas fa-check text-xs flex-shrink-0 ml-2" aria-hidden="true"></i>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomDropdown;
