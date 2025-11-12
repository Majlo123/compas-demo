import { useState, useRef, useEffect, FC } from 'react';

import ModalIconChevronDown from '@/components/images/ModalIconChevronDown';
import useOutsideClick from '@/hooks/useOutsideClick';
import classNameBuilder from '@/utils/classNameBuilder';

export type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = {
  className?: string;
  options: SelectOption[];
  value: SelectOption | null;
  placeholder?: string;
  onChange?: (selected: SelectOption) => void;
  onBlur?: () => void;
  error?: string;
  label?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
};

const Select: FC<SelectProps> = ({
  className,
  options,
  value,
  label,
  required,
  id,
  placeholder,
  error,
  onChange,
  onBlur,
  disabled,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDirection, setOpenDirection] = useState<'up' | 'down'>('down');
  const ref = useOutsideClick<HTMLDivElement>(() => {
    setIsOpen(false);
  });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (): void => {
    if (disabled) {
      return;
    }
    if (options.length === 0) {
      return;
    }
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (isOpen && buttonRef.current && dropdownRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const dropdownHeight = dropdownRef.current.offsetHeight;

      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        setOpenDirection('up');
      } else {
        setOpenDirection('down');
      }
    }
  }, [isOpen]);

  return (
    <div
      ref={ref}
      onBlur={onBlur}
      className={classNameBuilder(className, 'relative min-w-[200px]')}
    >
      {label && (
        <label
          htmlFor={id}
          className="flex items-center text-p1 text-pureBlack h-8 mb-[10px]"
        >
          <span className="mr-1">{label}</span>
          {required && <span className="text-red"> *</span>}
        </label>
      )}
      <button
        id={id}
        ref={buttonRef}
        type="button"
        onClick={toggleDropdown}
        disabled={disabled}
        className={classNameBuilder(
          'w-full h-10 flex flex-row justify-between items-center px-3',
          'border rounded-lg focus:outline-none bg-transparent border-someGrey',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          options.length === 0 && 'cursor-not-allowed'
        )}
      >
        <span>{value ? value.label : placeholder || 'Select'}</span>
        <ModalIconChevronDown className="ml-auto stroke-someGrey" />
      </button>
      {error && (
        <span className="flex flex-col justify-center text-p2 text-red h-8 w-full">
          {error}
        </span>
      )}
      {isOpen && Boolean(options.length) && (
        <div
          ref={dropdownRef}
          className={classNameBuilder(
            'absolute w-full h-fit max-h-[400px] overflow-hidden overflow-y-auto z-50',
            'bg-white border border-someGrey rounded-b-lg shadow-lg',
            openDirection === 'down'
              ? 'top-full mt-1 origin-top animate-scale-in'
              : 'bottom-full mb-1 origin-bottom animate-scale-in'
          )}
        >
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                onChange?.(option);
                setIsOpen(false);
              }}
              className="px-3 py-2 cursor-pointer hover:bg-lightGrey transition"
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;
