import React from 'react';
import { Button } from './Button';
import { twMerge } from 'tailwind-merge';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({ className, onSearch, ...props }) => {
  const handleSearch = () => {
    if (onSearch && props.value) {
      onSearch(props.value as string);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
    props.onKeyDown?.(e);
  };

  return (
    <div className={twMerge("relative flex items-center w-full", className)}>
      <input
        type="text"
        className="w-full py-1.5 pl-3 pr-14 text-p1 placeholder:text-p2 placeholder-up bg-surface rounded-full focus:outline-none focus:ring-2 focus:ring-primary border-none"
        onKeyDown={handleKeyDown}
        {...props}
      />
      <div className="absolute left-auto right-0">
        <Button 
            variant="round" 
            icon="search"
            onClick={handleSearch}
            type="button"
            className="p-2"
        />
      </div>
    </div>
  );
};
