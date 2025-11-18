import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as z from 'zod';

import Button from '@/components/controls/button/Button';
import DummyFormFields from '@/components/forms/dummy/DummyFormFields';
import FormErrorSection from '@/components/forms/FormErrorSection';
import { isFormSubmittable } from '@/components/forms/formsUtil.ts';
import useThrottledSubmission from '@/hooks/UseThrottledSubmission';
import classNameBuilder from '@/utils/classNameBuilder';

const dummySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
});

export type DummyFormData = z.infer<typeof dummySchema>;

type DummyFormProps = {
  className?: string;
};

const DummyForm: FC<DummyFormProps> = ({ className }) => {
  const [serverError, setServerError] = useState<string | null>(null);

  const { control, handleSubmit, formState } = useForm<DummyFormData>({
    resolver: zodResolver(dummySchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: { name: '', email: '' },
  });

  const { errors, isSubmitting } = formState;

  const isGoodToGoAgain = useThrottledSubmission({
    isSubmitting,
    delay: 2000,
  });

  const disableSubmit =
    !isFormSubmittable(errors, isSubmitting) || !isGoodToGoAgain;

  const onSubmit = async (data: DummyFormData): Promise<void> => {
    try {
      toast.success(`Form submitted! Name: ${data.name}, Email: ${data.email}`);
    } catch {
      setServerError('Something went wrong');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={classNameBuilder('dummy-form', className)}
    >
      <FormErrorSection error={serverError} className="mb-2 mx-6" />

      <DummyFormFields className="mb-6" control={control} errors={errors} />

      <Button
        type="submit"
        className="w-full h-[55px]"
        disabled={disableSubmit}
      >
        Submit
      </Button>
    </form>
  );
};

export default DummyForm;
