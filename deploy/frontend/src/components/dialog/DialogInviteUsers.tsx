import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import Button from '@/components/controls/button/Button';
import CustomDialog from '@/components/dialog/dialog-props';
import FormTextInput from '@/components/controls/FormTextInput';
import { inviteUsers as inviteUsersApi } from '@/api/user/user.actions';
import { isApiSuccess } from '@/api/shared.types';

const emailSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type FormData = z.infer<typeof emailSchema>;

interface PendingInvite {
  email: string;
}

interface DialogInviteUsersProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const DialogInviteUsers: React.FC<DialogInviteUsersProps> = ({
  isOpen,
  onOpenChange,
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [inviteList, setInviteList] = useState<PendingInvite[]>([]);

  const {
    control,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
  });

  const currentEmail = watch('email');
  const trimmedEmail = currentEmail?.trim() || '';

  const handleAddEmail = handleFormSubmit(async (data) => {
    const email = data.email.trim().toLowerCase();

    const duplicate = inviteList.some(inv => inv.email === email);
    if (duplicate) {
      toast.error('Email already added to the list');
      return;
    }

    setInviteList(prev => [...prev, { email }]);
    reset({ email: '' });
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
      const emails = inviteList.map(inv => inv.email);
      const response = await inviteUsersApi(emails);

      if (isApiSuccess(response)) {
        const { invited, failed } = response.content;
        
        // Show success message
        if (invited.length > 0) {
          toast.success(
            `Successfully sent ${invited.length} invitation${invited.length > 1 ? 's' : ''}!`,
            { autoClose: 3000 }
          );
        }

        // Show failures if any
        if (failed.length > 0) {
          failed.forEach(failure => {
            toast.error(`${failure.email}: ${failure.reason}`, { autoClose: 5000 });
          });
        }

        // Reset and close if at least one was successful
        if (invited.length > 0) {
          setInviteList([]);
          reset();
          onOpenChange(false);

          if (onSuccess) {
            onSuccess();
          }
        } else {
          setError('All invitations failed. Please check the errors above.');
        }
      } else {
        setError(response.error.message || 'Failed to invite users');
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
            required
          />
          <div className="flex justify-end mt-2">
            <Button
              type="submit"
              size="sm"
              disabled={!trimmedEmail || !!errors.email || isSubmitting}
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