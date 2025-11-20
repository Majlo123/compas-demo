import { FC } from 'react';

import Button from '@/components/controls/button/Button';
import classNameBuilder from '@/utils/classNameBuilder';

type FormFooterProps = {
  className?: string;
  onCancel?: () => void;
  onSubmit?: () => void;
  disableSubmit?: boolean;
  cancelText?: string;
  confirmText?: string;
};

const FormFooter: FC<FormFooterProps> = ({
  className,
  onCancel,
  onSubmit,
  disableSubmit,
  cancelText = 'Cancel',
  confirmText = 'Submit',
}) => {
  return (
    <div
      className={classNameBuilder(
        className,
        'form-footer',
        'flex flex-row items-center justify-center gap-6 h-[82px]'
      )}
    >
      {!!onCancel && (
        <Button type="button" onClick={onCancel} className="w-[112px]">
          {cancelText}
        </Button>
      )}
      {!!onSubmit && (
        <Button
          type="submit"
          onClick={onSubmit}
          disabled={disableSubmit}
          className="w-[112px]"
        >
          {confirmText}
        </Button>
      )}
    </div>
  );
};

export default FormFooter;
