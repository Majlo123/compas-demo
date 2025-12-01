import {
  ButtonWithIcon,
  ButtonWithoutIcon,
} from '@/components/controls/button/button-props';
import { tv } from 'tailwind-variants';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'delete' | 'edit';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = (ButtonWithIcon | ButtonWithoutIcon) & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  large?: boolean;
};

const buttonVariants = tv({
  base: 'flex align-center justify-center items-center rounded-button',
  variants: {
    variant: {
      primary: 'bg-primary !text-white hover:opacity-90 hover:bg-primary-hover',
      secondary: 'bg-white text-primary border border-primary hover:opacity-90',
      ghost: 'bg-transparent text-primary hover:opacity-90',
      delete: 'bg-transparent !text-red hover:opacity-90 border border-red hover:bg-white',
      edit: 'bg-primary !text-white hover:bg-primary-hover',
    },
    size: {
      sm: 'h-button-sm px-sm text-h5',
      md: 'h-button-md px-md text-h4',
      lg: 'h-button-lg px-lg text-h3',
    },
    disabled: {
      true: 'cursor-not-allowed',
    },
    large: {
      true: 'w-button-xl',
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
      lg: 'w-8 h-8',
    },
    variant: {
      primary: 'stroke-white',
      secondary: 'stroke-primary',
      ghost: 'stroke-primary',
      delete: 'stroke-white',
      edit: 'stroke-white',
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
}: ButtonProps): JSX.Element => {
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