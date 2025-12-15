import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import CustomDialog from '@/components/dialog/dialog-props';
import Button from '@/components/controls/button/Button';
import FormTextInput from '@/components/controls/FormTextInput';

const clientFormSchema = z.object({
  name: z.string().min(1, 'Client name is required.'),
  hourlyRate: z.preprocess((val) => {
    if (typeof val === 'string') {
      const n = Number(val);
      return Number.isNaN(n) ? val : n;
    }
    return val;
  }, z.number({ invalid_type_error: 'Hourly rate must be a number.' }).positive('Enter a valid hourly rate greater than 0.')),
});

type ClientForm = z.infer<typeof clientFormSchema>;

type DialogClientFormProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onCreate?: (data: { name: string; hourlyRate: number }) => Promise<void>;
};

const DialogClientForm: FC<DialogClientFormProps> = ({ isOpen, onOpenChange, onCreate }) => {
  const { control, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ClientForm>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: { name: '', hourlyRate: '' as any },
    mode: 'onChange',
  });

  const onSubmitHandler = async (data: ClientForm) => {
    if (!onCreate) {
      toast.error('Create handler not provided');
      return;
    }
    try {
      await onCreate({ name: data.name, hourlyRate: data.hourlyRate });
      reset();
      onOpenChange(false);
    } catch (err) {
      // Error handling is done in the parent component
    }
  };

  return (
    <CustomDialog
      title="New Client"
      description="Enter details for the new client."
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <div>
          <FormTextInput
            name="name"
            control={control}
            errors={errors}
            type="text"
            inputClassName="w-full"
            placeholder="Enter client name"
            label="Client Name"
            required
          />
        </div>
        <div>
          <FormTextInput
            name="hourlyRate"
            control={control}
            errors={errors}
            type="number"
            inputMode="decimal"
            inputClassName="w-full"
            placeholder="Enter hourly rate"
            label="Hourly Rate"
            required
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Client'}
          </Button>
        </div>
      </form>
    </CustomDialog>
  );
};

export default DialogClientForm;