import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import CustomDialog from '@/components/dialog/dialog-props';
import FormSelect from '@/components/controls/FormSelect';
import CustomDatePicker from '@/components/controls/CustomDatePicker';
import Button from '@/components/controls/button/Button';
import { LeaveRequestType } from '@/api/leave-request/leaveRequest.types';
import { getUserProfile } from '@/api/user/user.actions';
import { isApiSuccess } from '@/api/shared.types';
import { getAllCollectiveDaysOff } from '@/api/collective-day-off/collectiveDayOff.actions';
import { CollectiveDayOff } from '../../../../shared/collectiveDayOff.types';


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
  const [collectiveDaysOff, setCollectiveDaysOff] = useState<CollectiveDayOff[]>([]);
  const [collectiveDayOffError, setCollectiveDayOffError] = useState<string>('');

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
  const startDate = watch('startDate');
  const endDate = watch('endDate');

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

  // Fetch collective days off
  useEffect(() => {
    const fetchCollectiveDaysOff = async () => {
      if (isOpen) {
        try {
          const response = await getAllCollectiveDaysOff();
          if (isApiSuccess(response)) {
            setCollectiveDaysOff(response.content);
          }
        } catch (error) {
          console.error('Failed to fetch collective days off:', error);
        }
      }
    };
    fetchCollectiveDaysOff();
  }, [isOpen]);

  // Check for collective days off overlap
  useEffect(() => {
    if (startDate && endDate && collectiveDaysOff.length > 0) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      const hasOverlap = collectiveDaysOff.some(dayOff => {
        const offStart = new Date(dayOff.startDate);
        const offEnd = new Date(dayOff.endDate);
        return (start <= offEnd && end >= offStart);
      });

      if (hasOverlap) {
        setCollectiveDayOffError('Your selected dates overlap with collective days off. Please choose different dates.');
      } else {
        setCollectiveDayOffError('');
      }
    } else {
      setCollectiveDayOffError('');
    }
  }, [startDate, endDate, collectiveDaysOff]);

  // Get disabled dates (collective days off)
  const getDisabledDates = () => {
    const disabledDates: string[] = [];
    collectiveDaysOff.forEach(dayOff => {
      const start = new Date(dayOff.startDate);
      const end = new Date(dayOff.endDate);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        disabledDates.push(d.toISOString().split('T')[0]);
      }
    });
    return disabledDates;
  };

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
    // Check for collective days off
    if (collectiveDayOffError) {
      toast.error(collectiveDayOffError);
      return;
    }

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
          <CustomDatePicker
            label="Start Date"
            required
            error={errors.startDate?.message}
            min={new Date().toISOString().split('T')[0]}
            disabledDates={getDisabledDates()}
            value={startDate}
            onChange={(date) => setValue('startDate', date)}
          />
        </div>
        <div className="mb-lg">
          <CustomDatePicker
            label="End Date"
            required
            error={errors.endDate?.message}
            min={new Date().toISOString().split('T')[0]}
            disabledDates={getDisabledDates()}
            value={endDate}
            onChange={(date) => setValue('endDate', date)}
          />
        </div>
        {collectiveDayOffError && (
          <div className="mb-lg p-md bg-red-50 border border-red rounded-lg text-red text-p2">
            {collectiveDayOffError}
          </div>
        )}
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
          <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting || !!collectiveDayOffError}>
            {isSubmitting ? (mode === 'edit' ? 'Updating...' : 'Submitting...') : (mode === 'edit' ? 'Update' : 'Submit')}
          </Button>
        </div>
      </form>
    </CustomDialog>
  );
};

export default DialogLeaveRequestForm;