import { ComponentPropsWithoutRef } from 'react';
import {
  Controller,
  Control,
  FieldValues,
  FieldErrors,
  Path,
} from 'react-hook-form';

import TextInput from '@/components/controls/TextInput';

type FormTextInputProps<T extends FieldValues> = {
  className?: string;
  label?: string;
  control: Control<T>;
  name: Path<T>;
  errors: FieldErrors<T>;
  required?: boolean;
  passwordToggle?: boolean;
  inputClassName?: string;
} & ComponentPropsWithoutRef<'input'>;

const FormTextInput = <T extends FieldValues>({
  label,
  required,
  control,
  name,
  errors,
  className,
  disabled,
  passwordToggle,
  inputClassName,
  ...rest
}: FormTextInputProps<T>): JSX.Element => {
  const error = errors[name]?.message as string | undefined;
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value, onBlur, ref } }) => (
        <TextInput
          {...rest}
          id={name}
          className={className}
          InputclassName={inputClassName}
          label={label}
          required={required}
          value={value}
          onChange={onChange}
          disabled={disabled}
          onBlur={onBlur}
          ref={ref}
          error={error}
          passwordToggle={passwordToggle}
        />
      )}
    />
  );
};

export default FormTextInput;
