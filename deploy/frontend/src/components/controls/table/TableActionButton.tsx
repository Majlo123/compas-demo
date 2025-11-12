import { FC } from 'react';

import { ButtonWithIcon } from '@/components/controls/button/button-props';
import classNameBuilder from '@/utils/classNameBuilder';

const TableActionButton: FC<ButtonWithIcon> = ({
  Icon,
  iconClassName,
  disabled,
  ...rest
}) => {
  return (
    <button
      className={classNameBuilder(
        'flex align-center justify-center items-center h-8 w-8 rounded-[50%]',
        'hover:bg-grey',
        disabled && 'opacity-100 bg-darkGrey/20 cursor-not-allowed'
      )}
      {...rest}
    >
      <Icon
        className={classNameBuilder(
          iconClassName,
          'w-4 h-4',
          'stroke-darkGrey',
          disabled && 'opacity-100'
        )}
      />
    </button>
  );
};

export default TableActionButton;
