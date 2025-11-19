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
            className="flex items-center text-p1 text-pureBlack h-8 mb-[10px]"
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
              'w-full px-4 py-4',
              InputclassName,
              'outline-none border-none !ring-0 bg-transparent text-p2 text-[12px] text-darkGrey',
              disabled && 'bg-transparent !cursor-not-allowed'
            )}
            disabled={disabled}
            type="date"
          />
        </div>

        <span
          className={classNameBuilder(
            'flex flex-col justify-center text-p2 h-8 w-full',
            error ? 'text-red' : 'text-transparent'
          )}
          aria-live="polite"
          role={error ? 'alert' : undefined}
        >
          {error ?? '\u00A0'}
        </span>
      </div>
    );
  }
);

DateInput.displayName = 'DateInput';

export default DateInput;