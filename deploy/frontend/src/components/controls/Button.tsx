import { Filter, Search, Plus, Minus } from 'lucide-react';
import React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

const button = tv({
    base: 'px-6 py-3 rounded-full text-secondary text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center gap-2',
    variants: {
        variant: {
            primary: 'bg-primary focus:ring-primary disabled:bg-primary/50',
            secondary: 'bg-white border border-secondary focus:ring-gray-500',
            black: 'bg-black focus:ring-black disabled:bg-disabled text-white',
            round: 'rounded-full bg-primary focus:ring-primary disabled:bg-primary/50 p-3',
            small: 'px-2 py-2 rounded-lg bg-primary focus:ring-primary disabled:bg-primary/50',
        },
    },
    defaultVariants: {
        variant: 'primary',
    },
});

type IconType = 'search' | 'filter' | 'plus' | 'minus';

const Icons: Record<IconType, React.ElementType> = {
    search: Search,
    filter: Filter,
    plus: Plus,
    minus: Minus,
};

interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {
    icon?: IconType;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    className,
    variant,
    icon,
    ...props
}) => {
    const IconComponent = icon ? Icons[icon] : null;

    return (
        <button className={button({ variant, className })} {...props}>
            {IconComponent && <IconComponent size={16} />}
            {children}
        </button>
    );
};
