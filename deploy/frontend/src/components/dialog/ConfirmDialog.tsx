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
            className="px-4 py-2 bg-white hover:bg-gray-100"
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            variant="primary"
            className={`px-4 py-2 ${
              variant === 'danger' 
                ? 'bg-rose-500 hover:bg-rose-600' 
                : 'hover:bg-primary-hover'
            }`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </CustomDialog>
  );
};

export default ConfirmDialog;
