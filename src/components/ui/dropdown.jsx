import React, { useState } from 'react';
import { ChevronDownIcon } from 'lucide-react';

export const Dropdown = ({
  options,
  onSelect,
  label = 'Select an option',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    onSelect(option);
    toggleDropdown();
  };

  return (
    <div className={`relative inline-block text-left ${className}`}>
      <DropdownTrigger>
        <button
          type="button"
          className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
          onClick={toggleDropdown}
        >
          {selectedOption?.label || label}
          <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" />
        </button>
      </DropdownTrigger>

      {isOpen && (
        <DropdownContent>
          {options.map((option, index) => (
            <DropdownItem
              key={index}
              onClick={(e) => {
                e.preventDefault();
                handleOptionClick(option);
              }}
            >
              {option.label}
            </DropdownItem>
          ))}
        </DropdownContent>
      )}
    </div>
  );
};

export const DropdownTrigger = ({ children }) => {
  return children;
};

export const DropdownContent = ({ children }) => {
  return (
    <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
      <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
        {children}
      </div>
    </div>
  );
};

export const DropdownItem = ({ children, onClick }) => {
  return (
    <a
      href="#"
      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
      onClick={onClick}
      role="menuitem"
    >
      {children}
    </a>
  );
};