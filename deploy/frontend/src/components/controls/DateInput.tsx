import { ComponentPropsWithRef, forwardRef } from 'react';
import classNameBuilder from '@/utils/classNameBuilder';

type DateInputProps = {
  label?: string;
  required?: boolean;
  error?: string;
  InputclassName?: string;
} & ComponentPropsWithRef<'input'>;

const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  (
    {
      className = '',
      InputclassName = '',
      id,
      label,
      error,
      disabled,
      required,
      ...rest
    },
    ref
  ) => {
    return (
      <div
        className={classNameBuilder(
          className,
          'date-input-wrapper',
          `flex flex-col items-start`
        )}
      >
        {label && (
          <label
            htmlFor={id}
            className="flex items-center text-p2 text-pureBlack mb-sm"
          >
            <span className="mr-1">{label}</span>
            {required && <span className="text-red">*</span>}
          </label>
        )}
        <div
          className={classNameBuilder(
            InputclassName,
            'w-full',
            'input-container',
            'flex flex-row justify-between items-center relative',
            'border rounded-lg transition-colors overflow-hidden',
            !error && !disabled && '!border-someGrey',
            error && !disabled && '!border-red',
            disabled && 'cursor-not-allowed !border-someGrey opacity-50'
          )}
        >
          <input
            {...rest}
            ref={ref}
            id={id}
            className={classNameBuilder(
              'w-full p-md',
              InputclassName,
              'outline-none border-none !ring-0 bg-transparent text-p2 text-darkGrey',
              'hover:cursor-pointer', // Add hover effect for pointer cursor
              disabled && 'bg-transparent !cursor-not-allowed'
            )}
            disabled={disabled}
            type="date"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <span className="icon-calendar hover:cursor-pointer" />
          </div>
        </div>
      </div>
    );
  }
);

DateInput.displayName = 'DateInput';

export default DateInput;