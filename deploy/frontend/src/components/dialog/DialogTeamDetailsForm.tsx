import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '@/components/controls/button/Button';
import CustomDialog from '@/components/dialog/dialog-props';
import FormTextInput from '@/components/controls/FormTextInput';

interface FormData {
  searchQuery: string;
}

interface DialogTeamDetailsFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { userId: string; isManager: boolean }) => Promise<void>;
}

const DialogTeamDetailsForm: React.FC<DialogTeamDetailsFormProps> = ({
  isOpen,
  onOpenChange,
  onSubmit,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const {
    control,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      searchQuery: '',
    },
  });

  const handleSubmit = handleFormSubmit(async (data) => {
    setError('');
    setIsSubmitting(true);

    try {
      await onSubmit({
        userId: data.searchQuery, // TODO: This should be actual user ID after search
        isManager: false,
      });

      // Reset form on success
      reset();
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || 'Failed to add user');
    } finally {
      setIsSubmitting(false);
    }
  });

  const handleCancel = () => {
    reset();
    setError('');
    onOpenChange(false);
  };

  return (
    <CustomDialog
      title="Add User to Team"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormTextInput
          name="searchQuery"
          label="Find User"
          control={control}
          errors={errors}
          placeholder="Search by name or email..."
          disabled={isSubmitting}
          required
        />
        {error && <p className="text-red text-sm">{error}</p>}

        <div className="flex gap-3 justify-end pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Confirm'}
          </Button>
        </div>
      </form>
    </CustomDialog>
  );
};

export default DialogTeamDetailsForm;
