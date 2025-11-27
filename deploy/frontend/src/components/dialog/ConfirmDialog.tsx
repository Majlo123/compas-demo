import { FC } from 'react';
import CustomDialog from '@/components/dialog/dialog-props';
import Button from '@/components/controls/button/Button';

type ConfirmDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  variant?: 'danger' | 'primary';
};

const ConfirmDialog: FC<ConfirmDialogProps> = ({
  isOpen,
  onOpenChange,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'primary',
}) => {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onOpenChange(false);
  };

  return (
    <CustomDialog
      title={title}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <div className="space-y-4">
        <p className="text-p1 text-gray-700">{message}</p>
        <div className="flex gap-3 justify-end">
          <Button
            onClick={handleCancel}
            variant="secondary"
            className="px-4 py-2"
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            variant={variant === 'danger' ? 'primary' : 'primary'}
            className={`px-4 py-2 ${variant === 'danger' ? 'bg-red hover:bg-red-600' : ''}`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </CustomDialog>
  );
};

export default ConfirmDialog;
