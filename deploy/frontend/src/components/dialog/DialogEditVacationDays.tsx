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
  currentVacationDaysInit: number;
  currentVacationDaysLeft: number;
  onSuccess?: () => void;
}

const DialogEditVacationDays: React.FC<DialogEditVacationDaysProps> = ({
  isOpen,
  onOpenChange,
  userId,
  userName,
  currentVacationDaysInit,
  currentVacationDaysLeft,
  onSuccess,
}) => {
  const [vacationDaysInit, setVacationDaysInit] = useState<number>(currentVacationDaysInit);
  const [vacationDaysLeft, setVacationDaysLeft] = useState<number>(currentVacationDaysLeft);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setVacationDaysInit(currentVacationDaysInit);
      setVacationDaysLeft(currentVacationDaysLeft);
      setError('');
    }
  }, [isOpen, currentVacationDaysInit, currentVacationDaysLeft]);

  // Validate inputs in real-time
  useEffect(() => {
    if (vacationDaysInit < 0 || vacationDaysLeft < 0) {
      setError('Vacation days cannot be negative');
    } else if (vacationDaysLeft > vacationDaysInit) {
      setError('Remaining days cannot exceed initial days');
    } else {
      setError('');
    }
  }, [vacationDaysInit, vacationDaysLeft]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation is handled by useEffect, but double-check before submitting
    if (error) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await updateUserVacationDays(userId, vacationDaysInit, vacationDaysLeft);

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
        setError(response.error?.message || 'Failed to update vacation days');
      }
    } catch (error) {
      console.error('Exception updating vacation days:', error);
      setError('An error occurred while updating vacation days');
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

          <label htmlFor="vacationDaysInit" className="block text-sm font-medium text-gray-700 mb-2">
            Initial Vacation Days (Annual Allocation)
          </label>
          <input
            id="vacationDaysInit"
            type="number"
            min="0"
            value={vacationDaysInit}
            onChange={(e) => setVacationDaysInit(parseInt(e.target.value) || 0)}
            className="w-full border rounded-lg border-someGrey p-3 text-p2 mb-4"
            required
            disabled={isSubmitting}
          />

          <label htmlFor="vacationDaysLeft" className="block text-sm font-medium text-gray-700 mb-2">
            Remaining Vacation Days
          </label>
          <input
            id="vacationDaysLeft"
            type="number"
            min="0"
            max={vacationDaysInit}
            value={vacationDaysLeft}
            onChange={(e) => setVacationDaysLeft(parseInt(e.target.value) || 0)}
            className={`w-full border rounded-lg p-3 text-p2 ${error ? 'border-red' : 'border-someGrey'}`}
            required
            disabled={isSubmitting}
          />
          <p className="text-xs text-gray-500 mt-1">
            Current: {currentVacationDaysInit} initial, {currentVacationDaysLeft} remaining
          </p>
        </div>

        <div className="min-h-[20px]">
          {error && <p className="text-red text-sm">{error}</p>}
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
            disabled={isSubmitting || !!error}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </CustomDialog>
  );
};

export default DialogEditVacationDays;
