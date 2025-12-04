import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import Button from '@/components/controls/button/Button';
import FormTextInput from '@/components/controls/FormTextInput';
import { changePassword } from '@/api/auth.actions';
import { isApiSuccess } from '@/api/shared.types';

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Confirm password is required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

interface DialogChangePasswordProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const DialogChangePassword: React.FC<DialogChangePasswordProps> = ({
  isOpen,
  onOpenChange,
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: ChangePasswordForm) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await changePassword({
        currentPassword: data.currentPassword || '',
        newPassword: data.newPassword || '',
        confirmPassword: data.confirmPassword || '',
      });

      if (isApiSuccess(response)) {
        toast.success(response.message || 'Password changed successfully');
        reset();
        onOpenChange(false);
        onSuccess?.();
      } else {
        const errorMsg = !response.success
          ? (response.error?.message || 'Failed to change password')
          : 'Failed to change password';
        toast.error(errorMsg);
      }
    } catch (error) {
      toast.error('An error occurred while changing password');
      console.error('Change password error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Change Password</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormTextInput
            name="currentPassword"
            control={control}
            errors={errors}
            required
            type="password"
            inputClassName="w-full"
            placeholder="Current Password"
            passwordToggle
            disabled={isSubmitting}
          />

          <FormTextInput
            name="newPassword"
            control={control}
            errors={errors}
            required
            type="password"
            inputClassName="w-full"
            placeholder="New Password"
            passwordToggle
            disabled={isSubmitting}
          />

          <FormTextInput
            name="confirmPassword"
            control={control}
            errors={errors}
            required
            type="password"
            inputClassName="w-full"
            placeholder="Confirm New Password"
            passwordToggle
            disabled={isSubmitting}
          />

          <div className="flex gap-3 mt-6">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Changing...' : 'Change Password'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DialogChangePassword;
