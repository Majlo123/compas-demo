import { ComponentPropsWithRef, forwardRef, useState } from 'react';

import PasswordIconHide from '@/components/images/PasswordIconHide';
import PasswordIconShow from '@/components/images/PasswordIconShow';
import classNameBuilder from '@/utils/classNameBuilder';

type TextInputProps = {
  label?: string;
  required?: boolean;
  error?: string;
  passwordToggle?: boolean;
  InputclassName?: string;
} & ComponentPropsWithRef<'input'>;

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      className = '',
      InputclassName = '',
      id,
      label,
      error,
      disabled,
      required,
      passwordToggle,
      ...rest
    },
    ref
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const getInputType = (): string => {
      if (passwordToggle) {
        return isPasswordVisible ? 'text' : 'password';
      }
      return rest.type || 'text';
    };

    return (
      <div
        className={classNameBuilder(
          className,
          'text-input-wrapper',
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
            type={getInputType()}
          />
          <div className="absolute right-[16px] flex items-center justify-center">
            {passwordToggle && isPasswordVisible && (
              <button type="button" onClick={() => setIsPasswordVisible(false)}>
                {<PasswordIconShow className="stroke-darkGrey" />}
              </button>
            )}
            {passwordToggle && !isPasswordVisible && (
              <button type="button" onClick={() => setIsPasswordVisible(true)}>
                {<PasswordIconHide className="stroke-darkGrey" />}
              </button>
            )}
          </div>
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

TextInput.displayName = 'TextInput';

export default TextInput;
