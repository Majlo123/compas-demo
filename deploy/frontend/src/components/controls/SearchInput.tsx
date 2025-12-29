import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { Button } from './Button';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  className,
  onSearch,
  ...props
}) => {
  const [value, setValue] = useState('');

  const currentValue =
    typeof props.value === 'string' ? (props.value as string) : value;

  const handleSearch = () => {
    const term = (currentValue || '').trim();
    if (onSearch) {
      onSearch(term);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    props.onChange?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
    props.onKeyDown?.(e);
  };

  return (
    <div className={twMerge('relative flex items-center w-full', className)}>
      <input
        type="text"
        className="w-full py-3.5 pl-3 pr-14 text-p2 bg-surface rounded-full focus:outline-none focus:ring-2 focus:ring-primary border-none"
        {...props}
        value={currentValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <div className="absolute left-auto right-0">
        <Button
          variant="round"
          icon="search"
          onClick={handleSearch}
          type="button"
        />
      </div>
    </div>
  );
};
