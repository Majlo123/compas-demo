import { FC } from 'react';

import PrimaryButton from '@/components/controls/button/PrimaryButton';
import SecondaryButton from '@/components/controls/button/SecondaryButton.tsx';
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
        <SecondaryButton type="button" onClick={onCancel} className="w-[112px]">
          {cancelText}
        </SecondaryButton>
      )}
      {!!onSubmit && (
        <PrimaryButton
          type="submit"
          onClick={onSubmit}
          disabled={disableSubmit}
          className="w-[112px]"
        >
          {confirmText}
        </PrimaryButton>
      )}
    </div>
  );
};

export default FormFooter;
