import { FC, useState } from 'react';
import CustomDialog from '@/components/dialog/dialog-props';
import Select, { SelectOption } from '@/components/controls/Select';
import DateInput from '@/components/controls/DateInput';
import Button from '@/components/controls/button/Button';
import { LeaveRequestType } from '@/api/leave-request/leaveRequest.types';

type DialogFormProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit?: (data: { type: LeaveRequestType; startDate: string; endDate: string }) => Promise<void>;
};

const DialogForm: FC<DialogFormProps> = ({ isOpen, onOpenChange, onSubmit }) => {
  const [selectedLeaveType, setSelectedLeaveType] = useState<SelectOption | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ leaveType?: string; startDate?: string; endDate?: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { leaveType?: string; startDate?: string; endDate?: string } = {};

    if (!selectedLeaveType) {
      newErrors.leaveType = 'Please select a leave type';
    }

    if (!startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (start < today) {
        newErrors.startDate = 'Start date cannot be in the past';
      }

      if (end < start) {
        newErrors.endDate = 'End date cannot be before start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (onSubmit && selectedLeaveType) {
      setIsSubmitting(true);
      try {
        await onSubmit({ 
          type: selectedLeaveType.value as LeaveRequestType, 
          startDate, 
          endDate 
        });
        // Reset form on success
        setSelectedLeaveType(null);
        setStartDate('');
        setEndDate('');
        setErrors({});
      } catch (error) {
        // Error handling is done in parent component
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <CustomDialog
      title="New Leave Request"
      description="Fill out the form to create a new leave request."
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-md">
          <Select
            options={[
              { label: 'Vacation', value: 'vacation' },
              { label: 'Sick Leave', value: 'sick' },
              { label: 'Personal Leave', value: 'personal' },
              { label: 'Other', value: 'other' },
            ]}
            label="Leave Type"
            value={selectedLeaveType}
            placeholder="Select Leave Type"
            onChange={(selectedOption: SelectOption | null) => {
              setSelectedLeaveType(selectedOption);
              if (errors.leaveType) {
                setErrors({ ...errors, leaveType: undefined });
              }
            }}
          />
          {errors.leaveType && (
            <p className="text-red text-sm mt-1">{errors.leaveType}</p>
          )}
        </div>
        <div className="mb-md">
          <DateInput
            label="Start Date"
            required
            value={startDate}
            error={errors.startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              if (errors.startDate) {
                setErrors({ ...errors, startDate: undefined });
              }
            }}
          />
        </div>
        <div className="mb-xl">
          <DateInput
            label="End Date"
            required
            value={endDate}
            error={errors.endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              if (errors.endDate) {
                setErrors({ ...errors, endDate: undefined });
              }
            }}
          />
        </div>
        <div className="flex justify-end">
          <Button 
            type="submit" 
            variant="primary" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                Submitting...
              </span>
            ) : (
              'Submit'
            )}
          </Button>
        </div>
      </form>
    </CustomDialog>
  );
};

export default DialogForm;