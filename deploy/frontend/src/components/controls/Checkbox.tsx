import { ComponentPropsWithRef, forwardRef } from 'react';

import classNameBuilder from '@/utils/classNameBuilder';

type CheckboxProps = {
  label?: string;
  required?: boolean;
  error?: string;
  containerClassName?: string;
} & ComponentPropsWithRef<'input'>;

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className = '',
      containerClassName = '',
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
          containerClassName,
          'checkbox-wrapper',
          'flex flex-col items-start'
        )}
      >
        <div className="flex items-center">
          <input
            {...rest}
            ref={ref}
            id={id}
            type="checkbox"
            className={classNameBuilder(
              className,
              'w-5 h-5 rounded border border-someGrey text-primary',
              'focus:ring-2 focus:ring-primary focus:ring-offset-0',
              'cursor-pointer transition-colors',
              disabled && 'cursor-not-allowed opacity-50'
            )}
            disabled={disabled}
          />
          {label && (
            <label
              htmlFor={id}
              className={classNameBuilder(
                'ml-3 text-p1 text-pureBlack',
                disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
              )}
            >
              <span>{label}</span>
              {required && <span className="text-red ml-1">*</span>}
            </label>
          )}
        </div>

        {error && (
          <span
            className="flex flex-col justify-center text-p2 h-8 w-full text-red mt-1"
            aria-live="polite"
          >
            {error}
          </span>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
