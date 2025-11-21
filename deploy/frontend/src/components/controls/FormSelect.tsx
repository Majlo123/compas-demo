import {
  Controller,
  Control,
  FieldValues,
  FieldErrors,
  Path,
} from 'react-hook-form';

import Select, { SelectOption } from '@/components/controls/Select';

type FormSelectInputProps<T extends FieldValues> = {
  className?: string;
  label?: string;
  control: Control<T>;
  name: Path<T>;
  placeholder?: string;
  errors: FieldErrors<T>;
  required?: boolean;
  options: SelectOption[];
  disabled?: boolean;
};

const FormSelect = <T extends FieldValues>({
  label,
  placeholder,
  options,
  required,
  control,
  name,
  errors,
  className,
  disabled,
}: FormSelectInputProps<T>): JSX.Element => {
  const fieldError = errors[name];
  const error = fieldError?.message as string | undefined;
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value, onBlur } }) => (
        <Select
          id={name}
          placeholder={placeholder}
          className={className}
          label={label}
          required={required}
          value={value}
          options={options}
          onChange={onChange}
          onBlur={onBlur}
          error={error}
          disabled={disabled}
        />
      )}
    />
  );
};

export default FormSelect;
