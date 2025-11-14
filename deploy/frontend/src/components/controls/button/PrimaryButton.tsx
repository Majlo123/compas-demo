import {
  ButtonWithIcon,
  ButtonWithoutIcon,
} from '@/components/controls/button/button-props';
import classNameBuilder from '@/utils/classNameBuilder';

type PrimaryButtonProps = (ButtonWithIcon | ButtonWithoutIcon) & {
  large?: boolean;
};

const PrimaryButton = ({
  className,
  children,
  large = false,
  Icon,
  iconClassName = '',
  disabled = false,
  ...rest
}: PrimaryButtonProps): JSX.Element => {
  return (
    <button
      className={classNameBuilder(
        className,
        'flex align-center justify-center items-center h-[42px] px-4 rounded-[10px]',
        large && 'w-[450px]',
        'text-h4 text-white',
        disabled && 'opacity-100 bg-darkGrey/20 cursor-not-allowed',
        !disabled && 'hover:opacity-90 bg-[var(--primary-color)] hover:bg-[var(--primary-hover-color)]'
      )}
      disabled={disabled}
      {...rest}
    >
      {Icon && (
        <Icon
          className={classNameBuilder(
            iconClassName,
            'mr-1 w-6 h-6',
            'stroke-white',
            disabled && 'opacity-100'
          )}
        />
      )}
      {children}
    </button>
  );
};

export default PrimaryButton;
