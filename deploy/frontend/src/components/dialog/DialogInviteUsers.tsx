import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '@/components/controls/button/Button';
import CustomDialog from '@/components/dialog/dialog-props';
import FormTextInput from '@/components/controls/FormTextInput';

interface FormData {
  email: string;
}

interface PendingInvite {
  email: string;
}

interface DialogInviteUsersProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DialogInviteUsers: React.FC<DialogInviteUsersProps> = ({
  isOpen,
  onOpenChange,
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [inviteList, setInviteList] = useState<PendingInvite[]>([]);
  const [validationError, setValidationError] = useState('');

  const {
    control,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    reset,
    watch,
    clearErrors,
  } = useForm<FormData>({
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
  });

  const currentEmail = watch('email');
  const trimmedEmail = currentEmail?.trim() || '';
  const isEmailValid = trimmedEmail && emailRegex.test(trimmedEmail);

  // Real-time validation
  React.useEffect(() => {
    if (!trimmedEmail) {
      setValidationError('');
    } else if (!emailRegex.test(trimmedEmail)) {
      setValidationError('Please enter a valid email address');
    } else {
      setValidationError('');
    }
  }, [trimmedEmail]);

  const handleAddEmail = handleFormSubmit(async (data) => {
    const email = data.email.trim().toLowerCase();
    
    if (!emailRegex.test(email)) {
      setValidationError('Invalid email format');
      return;
    }

    const duplicate = inviteList.some(inv => inv.email === email);
    if (duplicate) {
      setValidationError('Email already added');
      return;
    }

    setInviteList(prev => [...prev, { email }]);
    reset({ email: '' });
    clearErrors('email');
    setValidationError('');
  });

  const handleRemoveEmail = (email: string) => {
    setInviteList(prev => prev.filter(inv => inv.email !== email));
  };

  const handleInvite = async () => {
    if (inviteList.length === 0) {
      setError('Please add at least one email');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      // Backend not implemented yet - just close dialog
      setInviteList([]);
      reset();
      setValidationError('');
      onOpenChange(false);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to invite users');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    reset();
    setError('');
    setValidationError('');
    setInviteList([]);
    onOpenChange(false);
  };

  return (
    <CustomDialog
      title="Invite Users"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <form onSubmit={handleAddEmail} className="space-y-4">
        <div>
          <FormTextInput
            name="email"
            label="Email Address"
            control={control}
            errors={errors}
            placeholder="Enter email address..."
            disabled={isSubmitting}
            required={false}
          />
          {validationError && (
            <p className="text-red text-sm mt-1">{validationError}</p>
          )}
          <div className="flex justify-end mt-2">
            <Button
              type="submit"
              size="sm"
              disabled={!isEmailValid || isSubmitting}
            >
              Add
            </Button>
          </div>
        </div>

        {inviteList.length > 0 && (
          <div className="border border-blue-300 bg-blue-50 rounded-lg p-3">
            <p className="text-sm font-semibold mb-2 text-blue-900">
              To be invited ({inviteList.length}):
            </p>
            <div className="space-y-1">
              {inviteList.map((inv, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm py-1">
                  <span className="font-medium">{inv.email}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveEmail(inv.email)}
                    className="text-red-600 hover:text-red-800 text-xs"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

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
            type="button"
            variant="primary"
            onClick={handleInvite}
            disabled={isSubmitting || inviteList.length === 0}
          >
            {isSubmitting ? 'Inviting...' : 'Invite'}
          </Button>
        </div>
      </form>
    </CustomDialog>
  );
};

export default DialogInviteUsers;