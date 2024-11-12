import React, { useState, useRef, useEffect, createContext, useContext } from 'react';

const SelectContext = createContext({
  isOpen: false,
  setIsOpen: () => {},
  selectedValue: null,
  handleSelect: () => {},
  disabled: false
});

export const Select = React.forwardRef(({ 
  className = '',
  children,
  value,
  onChange,
  disabled = false,
  ...props 
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);
  const selectRef = useRef(null);

  const handleClickOutside = (event) => {
    if (selectRef.current && !selectRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (value) => {
    setSelectedValue(value);
    onChange?.(value);
    setIsOpen(false);
  };

  return (
    <SelectContext.Provider 
      value={{ 
        isOpen, 
        setIsOpen, 
        selectedValue, 
        handleSelect, 
        disabled 
      }}
    >
      <div ref={selectRef} className={`relative ${className}`} {...props}>
        {children}
      </div>
    </SelectContext.Provider>
  );
});

export const SelectTrigger = React.forwardRef(({ 
  className = '',
  children,
  ...props 
}, ref) => {
  const { isOpen, setIsOpen, disabled } = useContext(SelectContext);
  
  return (
    <button
      ref={ref}
      type="button"
      onClick={() => !disabled && setIsOpen(!isOpen)}
      className={`
        flex h-10 w-full items-center justify-between 
        rounded-md border border-gray-200 bg-white px-3 py-2 
        text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
      <svg 
        className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
});

export const SelectValue = React.forwardRef(({ 
  className = '', 
  placeholder,
  ...props 
}, ref) => {
  const { selectedValue } = useContext(SelectContext);
  
  return (
    <span 
      ref={ref}
      className={`block truncate ${className}`}
      {...props}
    >
      {selectedValue || placeholder}
    </span>
  );
});

export const SelectContent = React.forwardRef(({ 
  className = '', 
  children,
  ...props 
}, ref) => {
  const { isOpen } = useContext(SelectContext);

  if (!isOpen) return null;

  return (
    <div 
      ref={ref}
      className={`
        absolute z-50 w-full mt-1 bg-white rounded-md border border-gray-200 
        shadow-lg max-h-60 overflow-auto
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
});

export const SelectItem = React.forwardRef(({ 
  className = '', 
  children, 
  value,
  ...props 
}, ref) => {
  const { handleSelect } = useContext(SelectContext);

  return (
    <div
      ref={ref}
      role="option"
      onClick={() => handleSelect(value)}
      className={`
        px-3 py-2 text-sm cursor-pointer hover:bg-gray-100
        focus:bg-gray-100 focus:outline-none
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
});

// Ajout des displayName
Select.displayName = 'Select';
SelectTrigger.displayName = 'SelectTrigger';
SelectValue.displayName = 'SelectValue';
SelectContent.displayName = 'SelectContent';
SelectItem.displayName = 'SelectItem';