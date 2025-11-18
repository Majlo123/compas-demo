import {
  ButtonWithIcon,
  ButtonWithoutIcon,
} from '@/components/controls/button/button-props';
import { tv } from 'tailwind-variants';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

type PrimaryButtonProps = (ButtonWithIcon | ButtonWithoutIcon) & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  large?: boolean;
};

const buttonVariants = tv({
  base: 'flex align-center justify-center items-center rounded-[10px]',
  variants: {
    variant: {
      primary: 'bg-primary !text-white hover:opacity-90 hover:bg-primary-hover',
      secondary: 'bg-white text-primary border border-primary hover:opacity-90',
      ghost: 'bg-transparent text-primary hover:opacity-90',
    },
    size: {
      sm: 'h-8 px-3 text-sm',
      md: 'h-[42px] px-4 text-h4',
      lg: 'h-12 px-6 text-lg',
    },
    disabled: {
      true: 'opacity-100 bg-darkGrey/20 cursor-not-allowed',
    },
    large: {
      true: 'w-[450px]',
    },
  },
  compoundVariants: [
    {
      disabled: true,
      class: 'hover:opacity-100',
    },
  ],
  defaultVariants: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    large: false,
  },
});

const iconVariants = tv({
  base: 'mr-1',
  variants: {
    size: {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-7 h-7',
    },
    variant: {
      primary: 'stroke-white',
      secondary: 'stroke-primary',
      ghost: 'stroke-primary',
    },
    disabled: {
      true: 'opacity-100',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'primary',
    disabled: false,
  },
});

const Button = ({
  className,
  children,
  variant = 'primary',
  size = 'md',
  large = false,
  Icon,
  iconClassName = '',
  disabled = false,
  ...rest
}: PrimaryButtonProps): JSX.Element => {
  return (
    <button
      className={buttonVariants({ variant, size, disabled, large, className })}
      disabled={disabled}
      {...rest}
    >
      {Icon && (
        <Icon
          className={iconVariants({ variant, size, disabled, className: iconClassName })}
        />
      )}
      {children}
    </button>
  );
};

export default Button;