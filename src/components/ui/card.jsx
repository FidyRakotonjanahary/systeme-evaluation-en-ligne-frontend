import React, { useState, forwardRef } from 'react';
import { ChevronDownIcon } from 'lucide-react';

const Card = forwardRef(({ className, ...props }, ref) => (
  <div className={`bg-white rounded-md shadow-md ${className}`} ref={ref} {...props} />
));
Card.displayName = 'Card';

const CardHeader = forwardRef(({ className, ...props }, ref) => (
  <div className={`px-4 py-3 border-b ${className}`} ref={ref} {...props} />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef(({ className, ...props }, ref) => (
  <h3 className={`text-lg font-medium ${className}`} ref={ref} {...props} />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef(({ className, ...props }, ref) => (
  <p className={`text-gray-500 ${className}`} ref={ref} {...props} />
));
CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef(({ className, ...props }, ref) => (
  <div className={`p-4 ${className}`} ref={ref} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = forwardRef(({ className, ...props }, ref) => (
  <div className={`px-4 py-3 border-t ${className}`} ref={ref} {...props} />
));
CardFooter.displayName = 'CardFooter';

const Button = forwardRef(({ className, ...props }, ref) => (
  <button className={`bg-blue-500 text-white px-4 py-2 rounded ${className}`} ref={ref} {...props} />
));
Button.displayName = 'Button';

const Listbox = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button className="bg-white border rounded px-4 py-2 flex items-center justify-between w-full" onClick={handleClick}>
        {value ? value.label : 'Select an option'}
        <ChevronDownIcon className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute bg-white border rounded shadow-md mt-2 w-full z-10">
          {options.map((option) => (
            <ListboxOption key={option.value} option={option} onClick={handleOptionSelect} />
          ))}
        </div>
      )}
    </div>
  );
};

const ListboxOption = ({ option, onClick }) => {
  return (
    <button className="block px-4 py-2 hover:bg-gray-100 w-full text-left" onClick={() => onClick(option)}>
      {option.label}
    </button>
  );
};

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Listbox, ListboxOption };