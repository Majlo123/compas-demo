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
import { getAllCollectiveDaysOff } from '@/api/collective-day-off/collectiveDayOff.actions';
import { CollectiveDayOff } from '../../../../shared/collectiveDayOff.types';
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
  const [collectiveDaysOff, setCollectiveDaysOff] = useState<CollectiveDayOff[]>([]);
  const [collectiveDayOffError, setCollectiveDayOffError] = useState<string>('');
  
  const leaveTypeOptions = [
    { label: 'Vacation', value: 'vacation' },
    { label: 'Sick Leave', value: 'sick' },
    { label: 'Personal Leave', value: 'personal' },
    { label: 'Other', value: 'other' },
  ];

  // Helper function to get all disabled dates (collective days off)
  const getDisabledDates = (): string[] => {
    const disabled: string[] = [];
    collectiveDaysOff.forEach(dayOff => {
      const start = new Date(dayOff.startDate);
      const end = new Date(dayOff.endDate);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        disabled.push(d.toISOString().split('T')[0]);
      }
    });
    return disabled;
  };

  // Load collective days off on component mount
  useEffect(() => {
    const loadCollectiveDaysOff = async () => {
      try {
        const response = await getAllCollectiveDaysOff();
        if (isApiSuccess(response)) {
          setCollectiveDaysOff(response.content);
        }
      } catch (error) {
        console.error('Failed to load collective days off:', error);
      }
    };
    loadCollectiveDaysOff();
  }, []);

  const { control, handleSubmit, formState: { errors, isSubmitting }, reset, setValue, watch } = useForm<LeaveRequestForm>({
    resolver: zodResolver(leaveRequestSchema),
    defaultValues: { leaveType: null, startDate: '', endDate: '' },
    mode: 'onChange',
  });

  // Watch start and end dates for collective day off validation
  const startDate = watch('startDate');
  const endDate = watch('endDate');

  // Check if any date in the range is a collective day off
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        const isCollectiveOff = collectiveDaysOff.some(dayOff => {
          const dayOffStart = new Date(dayOff.startDate).toISOString().split('T')[0];
          const dayOffEnd = new Date(dayOff.endDate).toISOString().split('T')[0];
          return dateStr >= dayOffStart && dateStr <= dayOffEnd;
        });
        
        if (isCollectiveOff) {
          setCollectiveDayOffError(`This date is a company-wide day off.`);
          return;
        }
      }
      setCollectiveDayOffError('');
    }
  }, [startDate, endDate, collectiveDaysOff]);

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
      toast.error(error?.message || 'Failed to submit leave request');
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
        <div className="mb-lg">
          <FormSelect
            name="leaveType"
            control={control}
            options={leaveTypeOptions}
            label="Leave Type"
            placeholder="Select Leave Type"
            errors={errors}
          />
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