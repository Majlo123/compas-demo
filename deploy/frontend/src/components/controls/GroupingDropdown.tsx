import React, { useState, useRef, useEffect } from 'react';
import { Grip, ChevronDown } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export interface GroupingOption {
  id: string;
  label: string;
}

interface GroupingDropdownProps {
  options: GroupingOption[];
  selectedOptionId: string;
  onSelect: (option: GroupingOption) => void;
  className?: string;
}

export const GroupingDropdown: React.FC<GroupingDropdownProps> = ({
  options,
  selectedOptionId,
  onSelect,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.id === selectedOptionId) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={twMerge('relative inline-block text-left z-50', className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-[220px] px-4 py-2 bg-white border border-black rounded-full shadow-sm hover:bg-gray-50 focus:outline-none transition-colors duration-200"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <Grip className="w-4 h-4 text-gray-600 flex-shrink-0" />
          <span className="text-sm font-medium text-gray-700 truncate max-w-[150px]" title={selectedOption?.label}>
            {selectedOption?.label}
          </span>
        </div>
        <ChevronDown className={`w-6 h-6 ml-2 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 z-10 w-max min-w-full mt-2 origin-top-left bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  onSelect(option);
                  setIsOpen(false);
                }}
                className={twMerge(
                  'flex items-center w-full px-4 py-2 text-p2 text-left transition-colors',
                  option.id === selectedOptionId
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50 border border-transparent'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
