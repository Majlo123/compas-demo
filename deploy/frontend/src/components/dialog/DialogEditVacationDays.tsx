import React, { useState, useEffect } from 'react';
import CustomDialog from './dialog-props';
import Button from '@/components/controls/button/Button';
import { updateUserVacationDays } from '@/api/user/user.actions';
import { isApiSuccess } from '@/api/shared.types';
import { toast } from 'react-toastify';

interface DialogEditVacationDaysProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userName: string;
  currentVacationDays: number;
  onSuccess?: () => void;
}

const DialogEditVacationDays: React.FC<DialogEditVacationDaysProps> = ({
  isOpen,
  onOpenChange,
  userId,
  userName,
  currentVacationDays,
  onSuccess,
}) => {
  const [vacationDays, setVacationDays] = useState<number>(currentVacationDays);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVacationDays(currentVacationDays);
    }
  }, [isOpen, currentVacationDays]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (vacationDays < 0) {
      toast.error('Vacation days cannot be negative');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await updateUserVacationDays(userId, vacationDays);

      if (isApiSuccess(response)) {
        toast.success(`Vacation days updated successfully for ${userName}`);
        onSuccess?.();
        onOpenChange(false);
      } else {
        if (response.error?.removeUser) {
          window.location.href = '/login';
          return;
        }
        console.error('Error updating vacation days:', response.error);
        toast.error(response.error?.message || 'Failed to update vacation days');
      }
    } catch (error) {
      console.error('Exception updating vacation days:', error);
      toast.error('An error occurred while updating vacation days');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CustomDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Edit Vacation Days"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-4">
            Set the annual vacation days for <strong>{userName}</strong>
          </p>

          <label htmlFor="vacationDays" className="block text-sm font-medium text-gray-700 mb-2">
            Vacation Days
          </label>
          <input
            id="vacationDays"
            type="number"
            min="0"
            value={vacationDays}
            onChange={(e) => setVacationDays(parseInt(e.target.value) || 0)}
            className="w-full border rounded-lg border-someGrey p-3 text-p2"
            required
            disabled={isSubmitting}
          />
          <p className="text-xs text-gray-500 mt-1">
            Current: {currentVacationDays} days
          </p>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </CustomDialog>
  );
};

export default DialogEditVacationDays;
