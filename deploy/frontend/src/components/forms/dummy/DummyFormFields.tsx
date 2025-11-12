import { FC } from 'react';
import { Control, FieldErrors } from 'react-hook-form';

import FormTextInput from '@/components/controls/FormTextInput';
import { DummyFormData } from '@/components/forms/dummy/DummyForm';
import classNameBuilder from '@/utils/classNameBuilder';

type DummyFormFieldsProps = {
  className?: string;
  errors: FieldErrors<DummyFormData>;
  control: Control<DummyFormData>;
};

const DummyFormFields: FC<DummyFormFieldsProps> = ({
  className,
  errors,
  control,
}) => {
  return (
    <div
      className={classNameBuilder(
        'dummy-form-fields',
        className,
        'gap-3 flex flex-col'
      )}
    >
      <FormTextInput
        id="dummyName"
        className="w-full"
        inputClassName="h-[55px] bg-gray-100 border-none"
        label="Name"
        control={control}
        name="name"
        errors={errors}
        placeholder="Enter your name"
        autoComplete="name"
      />
      <FormTextInput
        id="dummyEmail"
        className="w-full"
        inputClassName="h-[55px] bg-gray-100 border-none"
        label="Email"
        control={control}
        name="email"
        errors={errors}
        placeholder="Enter your email"
        autoComplete="email"
      />
    </div>
  );
};

export default DummyFormFields;
