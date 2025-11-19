import { FC } from 'react';
import { tv, VariantProps } from 'tailwind-variants';

const statusBadgeVariants = tv({
  base: 'inline-flex items-center justify-center px-3 py-1 rounded-full',
  variants: {
    status: {
      approved: 'bg-emerald-100 text-emerald-800',
      pending: 'bg-orange-100 text-orange-800',
      declined: 'bg-rose-100 text-rose-800',
    },
  },
  defaultVariants: {
    status: 'pending',
  },
});

type StatusBadgeProps = VariantProps<typeof statusBadgeVariants> & {
  className?: string;
  children: React.ReactNode;
};

const StatusBadge: FC<StatusBadgeProps> = ({ status, className, children }) => {
  return (
    <span className={statusBadgeVariants({ status, className })}>
      {children}
    </span>
  );
};

export default StatusBadge;
