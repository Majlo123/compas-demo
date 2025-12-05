import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import CustomDialog from '@/components/dialog/dialog-props';
import TextInput from '@/components/controls/TextInput';
import DateInput from '@/components/controls/DateInput';
import Button from '@/components/controls/button/Button';

const dayOffFormSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  title: z.string().min(1, 'Title is required').min(3, 'Title must be at least 3 characters'),
});

type DayOffFormData = z.infer<typeof dayOffFormSchema>;

interface DialogDayOffFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: DayOffFormData) => void;
  initialData?: DayOffFormData;
}

const DialogDayOffForm: React.FC<DialogDayOffFormProps> = ({
  isOpen,
  onOpenChange,
  onSubmit,
  initialData,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<DayOffFormData>({
    resolver: zodResolver(dayOffFormSchema),
    mode: 'onChange',
    defaultValues: initialData || {
      date: '',
      title: '',
    },
  });

  // Watch form changes to enable/disable save button
  watch();

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else if (!isOpen) {
      reset();
    }
  }, [initialData, reset, isOpen]);

  const onSubmitHandler = async (data: DayOffFormData) => {
    try {
      onSubmit(data);
      reset();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to submit day off. Please try again.');
    }
  };

  return (
    <CustomDialog
      title="Add Day Off"
      description="Add a new global day off for the organization."
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-lg">
        <div className="mb-xl">
          <DateInput
            label="Date"
            required
            error={errors.date?.message}
            min={new Date().toISOString().split('T')[0]}
            {...register('date')}
          />
        </div>
        <div className="mb-xl">
          <TextInput
            label="Description"
            placeholder="e.g., Christmas Day, New Year's Day"
            required
            error={errors.title?.message}
            {...register('title')}
          />
        </div>
        <div className="flex justify-end gap-md">
          <Button 
            type="submit" 
            variant="primary" 
            disabled={isSubmitting || !isValid} 
            className="w-full"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </CustomDialog>
  );
};

export default DialogDayOffForm;
