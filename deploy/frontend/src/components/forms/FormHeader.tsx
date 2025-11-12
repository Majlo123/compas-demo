import { FC } from 'react';

import ModalIconClose from '@/components/images/ModalIconClose';
import classNameBuilder from '@/utils/classNameBuilder';

type FormHeaderProps = {
  className?: string;
  headerText: string;
  onClose: () => void;
};

const FormHeader: FC<FormHeaderProps> = ({
  className,
  headerText,
  onClose,
}) => {
  return (
    <div
      className={classNameBuilder(
        className,
        'form-header',
        'flex flex-row justify-between items-center',
        'h-[94px] min-h-[94px] px-[24px]',
        'border-b-[1px] border-someGrey'
      )}
    >
      <h1 className="text-h1 text-[24px] text-pureBlack">{headerText}</h1>
      <button type="button" onClick={onClose}>
        <ModalIconClose className="stroke-pureBlack" />
      </button>
    </div>
  );
};

export default FormHeader;
