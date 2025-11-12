import {
  ButtonWithIcon,
  ButtonWithoutIcon,
} from '@/components/controls/button/button-props';
import classNameBuilder from '@/utils/classNameBuilder';

type SecundaryButtonProps = ButtonWithIcon | ButtonWithoutIcon;

const SecondaryButton = ({
  className,
  children,
  Icon,
  iconClassName = '',
  disabled = false,
  ...rest
}: SecundaryButtonProps): JSX.Element => {
  return (
    <button
      className={classNameBuilder(
        className,
        'flex align-center justify-center items-center h-[42px] px-4 rounded-[10px] ',
        'text-h4',
        disabled && 'opacity-100 text-white bg-darkGrey/20 cursor-not-allowed',
        !disabled &&
          'hover:opacity-90 text-darkGrey bg-transparent border-[1px] border-solid border-darkGrey'
      )}
      {...rest}
    >
      {Icon && (
        <Icon
          className={classNameBuilder(
            iconClassName,
            'mr-1 w-6 h-6',
            disabled && 'opacity-100 stroke-white',
            !disabled && 'stroke-darkGrey'
          )}
        />
      )}
      {children}
    </button>
  );
};

export default SecondaryButton;
