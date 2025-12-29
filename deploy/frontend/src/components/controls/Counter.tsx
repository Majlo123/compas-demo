import React, { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { Button } from '@/components/controls/Button';

interface CounterProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export const Counter: React.FC<CounterProps> = ({
  value,
  onIncrement,
  onDecrement,
  onChange,
  min,
  max,
  className,
}) => {
  const [localValue, setLocalValue] = useState<string>(value.toString());

  useEffect(() => {
    setLocalValue(value.toString());
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    // Allow only numbers and empty string
    if (e.target.value === '' || /^-?\d*$/.test(e.target.value)) {
      setLocalValue(e.target.value);
    }
  };

  const handleBlur = (): void => {
    let newValue = parseInt(localValue, 10);

    if (Number.isNaN(newValue)) {
      newValue = value; // Revert to prop value if invalid
    } else {
      if (min !== undefined && newValue < min) newValue = min;
      if (max !== undefined && newValue > max) newValue = max;
    }

    setLocalValue(newValue.toString());
    if (onChange && newValue !== value) {
      onChange(newValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  return (
    <div
      className={twMerge(
        'flex items-center justify-between border border-gray-200 rounded-md p-1 w-fit gap-2 bg-white',
        className
      )}
    >
      <Button
        variant="small"
        icon="minus"
        onClick={onDecrement}
        disabled={min !== undefined && value <= min}
        aria-label="Decrease value"
      />
      <input
        type="text"
        inputMode="numeric"
        className="text-p2 font-bold text-secondary w-6 text-center bg-transparent border-none focus:outline-none focus:ring-0 p-0"
        value={localValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        disabled={!onChange}
        aria-label="Value"
      />
      <Button
        variant="small"
        icon="plus"
        onClick={onIncrement}
        disabled={max !== undefined && value >= max}
        aria-label="Increase value"
      />
    </div>
  );
};
