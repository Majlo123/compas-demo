import { FC, useState } from 'react';
import CustomDialog from '@/components/dialog/dialog-props';
import Select, { SelectOption } from '@/components/controls/Select';
import DateInput from '@/components/controls/DateInput';
import Button from '@/components/controls/button/Button';

type DialogFormProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit?: (data: { leaveType: SelectOption | null; startDate: string; endDate: string }) => void;
};

const DialogForm: FC<DialogFormProps> = ({ isOpen, onOpenChange, onSubmit }) => {
  const [selectedLeaveType, setSelectedLeaveType] = useState<SelectOption | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ leaveType: selectedLeaveType, startDate, endDate });
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
              { label: 'Vacation', value: 'Vacation' },
              { label: 'Sick Leave', value: 'Sick Leave' },
              { label: 'Personal Leave', value: 'Personal Leave' },
              { label: 'Unpaid Leave', value: 'Unpaid Leave' },
            ]}
            label="Leave Type"
            value={selectedLeaveType}
            placeholder="Select Leave Type"
            onChange={(selectedOption: SelectOption | null) => setSelectedLeaveType(selectedOption)}
          />
        </div>
        <div className="mb-md">
          <DateInput
            label="Start Date"
            required
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="mb-xl">
          <DateInput
            label="End Date"
            required
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" variant="primary" className="w-full">
            Submit
          </Button>
        </div>
      </form>
    </CustomDialog>
  );
};

export default DialogForm;