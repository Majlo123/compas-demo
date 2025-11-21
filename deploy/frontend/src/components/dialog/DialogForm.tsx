import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import CustomDialog from '@/components/dialog/dialog-props';
import FormSelect from '@/components/controls/FormSelect';
import DateInput from '@/components/controls/DateInput';
import Button from '@/components/controls/button/Button';
import { LeaveRequestType } from '@/api/leave-request/leaveRequest.types';

const leaveRequestSchema = z.object({
  leaveType: z.object({
    label: z.string(),
    value: z.string(),
  }).nullable().refine(val => val !== null, 'Leave type is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return new Date(data.startDate) <= new Date(data.endDate);
    }
    return true;
  },
  { message: 'End date must be after start date', path: ['endDate'] }
);

type LeaveRequestForm = z.infer<typeof leaveRequestSchema>;

type DialogFormProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit?: (data: { type: LeaveRequestType; startDate: string; endDate: string }) => Promise<void>;
};

const DialogForm: FC<DialogFormProps> = ({ isOpen, onOpenChange, onSubmit }) => {
  const { register, control, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<LeaveRequestForm>({
    resolver: zodResolver(leaveRequestSchema),
    defaultValues: { leaveType: null, startDate: '', endDate: '' },
    mode: 'onChange',
  });

  const onSubmitHandler = async (data: LeaveRequestForm) => {
    try {
      if (onSubmit && data.leaveType) {
        await onSubmit({
          type: data.leaveType.value,
          startDate: data.startDate,
          endDate: data.endDate,
        });
      } else if (data.leaveType) {
        // If no onSubmit provided, just show success message
        toast.success('Leave request submitted successfully!');
      }
      reset();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to submit leave request');
    }
  };

  return (
    <CustomDialog
      title="New Leave Request"
      description="Fill out the form to create a new leave request."
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <form onSubmit={handleSubmit(onSubmitHandler)} className="flex flex-col gap-md">
        <FormSelect
          name="leaveType"
          control={control}
          errors={errors}
          label="Leave Type"
          placeholder="Select Leave Type"
          options={[
            { label: 'Vacation', value: 'vacation' },
            { label: 'Sick Leave', value: 'sick' },
            { label: 'Personal Leave', value: 'personal' },
            { label: 'Unpaid Leave', value: 'other' },
          ]}
          required
          disabled={isSubmitting}
        />

        <DateInput
          {...register('startDate')}
          label="Start Date"
          required
          error={errors.startDate?.message}
          disabled={isSubmitting}
        />

        <DateInput
          {...register('endDate')}
          label="End Date"
          required
          error={errors.endDate?.message}
          disabled={isSubmitting}
        />

        <div className="flex justify-end">
          <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </form>
    </CustomDialog>
  );
};

export default DialogForm;