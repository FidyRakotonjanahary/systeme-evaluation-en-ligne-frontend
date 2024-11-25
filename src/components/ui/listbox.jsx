import React, { useState } from 'react';
import { ChevronDownIcon } from 'lucide-react';

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
      <button
        type="button"
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={handleClick}
      >
        {value ? value.label : 'Select an option'}
        <ChevronDownIcon className={`h-5 w-5 text-gray-400 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <ul className="absolute z-10 w-full mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {options.map((option) => (
            <ListboxOption
              key={option.value}
              option={option}
              onClick={handleOptionSelect}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

const ListboxOption = ({ option, onClick }) => {
  return (
    <li
      className="px-4 py-2 text-gray-900 cursor-pointer hover:bg-indigo-500 hover:text-white"
      onClick={() => onClick(option)}
    >
      {option.label}
    </li>
  );
};

export { Listbox, ListboxOption };