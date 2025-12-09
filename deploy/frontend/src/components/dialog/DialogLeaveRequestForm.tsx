import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import CustomDialog from '@/components/dialog/dialog-props';
import FormSelect from '@/components/controls/FormSelect';
import DateInput from '@/components/controls/DateInput';
import Button from '@/components/controls/button/Button';
import { LeaveRequestType } from '@/api/leave-request/leaveRequest.types';
import { getUserProfile } from '@/api/user/user.actions';
import { isApiSuccess } from '@/api/shared.types';

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

type DialogLeaveRequestFormProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit?: (data: { type: LeaveRequestType; startDate: string; endDate: string }) => Promise<void>;
  onCancel?: () => Promise<void>;
  initialData?: {
    id?: string;
    type: LeaveRequestType;
    startDate: string;
    endDate: string;
  } | null;
  mode?: 'create' | 'edit';
};

const DialogLeaveRequestForm: FC<DialogLeaveRequestFormProps> = ({ 
  isOpen, 
  onOpenChange, 
  onSubmit,
  onCancel,
  initialData,
  mode = 'create'
}) => {
  const [vacationDaysLeft, setVacationDaysLeft] = useState<number>(0);
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(false);

  const leaveTypeOptions = [
    { label: 'Vacation', value: 'vacation' },
    { label: 'Sick Leave', value: 'sick' },
    { label: 'Personal Leave', value: 'personal' },
    { label: 'Other', value: 'other' },
  ];

  const { register, control, handleSubmit, formState: { errors, isSubmitting }, reset, setValue, watch } = useForm<LeaveRequestForm>({
    resolver: zodResolver(leaveRequestSchema),
    defaultValues: { leaveType: null, startDate: '', endDate: '' },
    mode: 'onChange',
  });

  const selectedLeaveType = watch('leaveType');

  // Fetch user profile to get vacation days left
  useEffect(() => {
    const fetchVacationDays = async () => {
      if (isOpen && mode === 'create') {
        setIsLoadingProfile(true);
        try {
          const response = await getUserProfile();
          if (isApiSuccess(response)) {
            setVacationDaysLeft(response.content.vacationDaysLeft ?? 0);
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
        } finally {
          setIsLoadingProfile(false);
        }
      }
    };
    fetchVacationDays();
  }, [isOpen, mode]);

  // Set initial values when editing
  useEffect(() => {
    if (initialData && isOpen) {
      const leaveTypeOption = leaveTypeOptions.find(opt => opt.value === initialData.type);
      setValue('leaveType', leaveTypeOption || null);
      setValue('startDate', initialData.startDate.split('T')[0]);
      setValue('endDate', initialData.endDate.split('T')[0]);
    } else if (!isOpen) {
      reset();
    }
  }, [initialData, isOpen]);

  const onSubmitHandler = async (data: LeaveRequestForm) => {
    try {
      if (onSubmit && data.leaveType) {
        await onSubmit({
          type: data.leaveType.value as LeaveRequestType,
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
      // Error is already handled and displayed by the parent component
      // Don't show another toast to avoid duplication
    }
  };

  const handleCancel = async () => {
    if (onCancel) {
      try {
        await onCancel();
        reset();
        onOpenChange(false);
      } catch (error: any) {
        toast.error(error?.message || 'Failed to cancel leave request');
      }
    }
  };

  return (
    <CustomDialog
      title={mode === 'edit' ? 'Edit Leave Request' : 'New Leave Request'}
      description={mode === 'edit' ? 'Update or cancel your leave request.' : 'Fill out the form to create a new leave request.'}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        {/* Warning message when no vacation days left */}
        {mode === 'create' && vacationDaysLeft === 0 && !isLoadingProfile && (
          <div className="mb-lg p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800 font-medium">
              ⚠️ You have no vacation days left.
            </p>
            <p className="text-xs text-red-600 mt-1">
              You can still request personal days, sick leave, or other leave types.
            </p>
          </div>
        )}
        
        <div className="mb-lg">
          <FormSelect
            name="leaveType"
            control={control}
            options={leaveTypeOptions.map(option => ({
              ...option,
              disabled: option.value === 'vacation' && vacationDaysLeft === 0 && mode === 'create'
            }))}
            label="Leave Type"
            placeholder="Select Leave Type"
            errors={errors}
          />
          {selectedLeaveType?.value === 'vacation' && vacationDaysLeft === 0 && mode === 'create' && (
            <p className="text-xs text-red-600 mt-1">
              Vacation requests are disabled because you have no vacation days remaining.
            </p>
          )}
        </div>
        <div className="mb-lg">
          <DateInput
            label="Start Date"
            required
            error={errors.startDate?.message}
            min={new Date().toISOString().split('T')[0]}
            {...register('startDate')}
          />
        </div>
        <div className="mb-lg">
          <DateInput
            label="End Date"
            required
            error={errors.endDate?.message}
            min={new Date().toISOString().split('T')[0]}
            {...register('endDate')}
          />
        </div>
        <div className="flex justify-end gap-4">
          {mode === 'edit' && (
            <Button
              type="button"
              variant="delete"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel Request
            </Button>
          )}
          <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (mode === 'edit' ? 'Updating...' : 'Submitting...') : (mode === 'edit' ? 'Update' : 'Submit')}
          </Button>
        </div>
      </form>
    </CustomDialog>
  );
};

export default DialogLeaveRequestForm;