import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from 'lucide-react';
import * as React from 'react';

import { cn } from '@/utils/cn';

const Pagination = ({
  className,
  ...props
}: React.ComponentProps<'nav'>): JSX.Element => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
);
Pagination.displayName = 'Pagination';

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('flex flex-row items-center gap-2', className)}
    {...props}
  />
));
PaginationContent.displayName = 'PaginationContent';

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('', className)} {...props} />
));
PaginationItem.displayName = 'PaginationItem';

type PaginationLinkProps = {
  isActive?: boolean;
} & React.ComponentProps<'a'>;

const PaginationLink = ({
  className,
  isActive,
  ...props
}: PaginationLinkProps): JSX.Element => (
  <a
    aria-current={isActive ? 'page' : undefined}
    aria-label={
      props['aria-label'] || (isActive ? 'Current page' : 'Go to page')
    }
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
      'h-9 w-9',
      isActive
        ? 'bg-primary rounded-full p-3'
        : 'hover:bg-gray-100 rounded-full p-3 hover:text-gray-900',
      className
    )}
    {...props}
  />
);
PaginationLink.displayName = 'PaginationLink';

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>): JSX.Element => (
  <PaginationLink
    aria-label="Go to previous page"
    className={cn('gap-1 pl-2.5 h-11 w-11', className)}
    {...props}
  >
    <ChevronLeft className="h-7 w-7" />
  </PaginationLink>
);
PaginationPrevious.displayName = 'PaginationPrevious';

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>): JSX.Element => (
  <PaginationLink
    aria-label="Go to next page"
    className={cn('gap-1 pr-2.5 h-11 w-11', className)}
    {...props}
  >
    <ChevronRight className="h-7 w-7" />
  </PaginationLink>
);
PaginationNext.displayName = 'PaginationNext';

const PaginationLast = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>): JSX.Element => (
  <PaginationLink
    aria-label="Go to last page"
    className={cn('gap-1 pr-2.5 h-11 w-11', className)}
    {...props}
  >
    <ChevronsRight className="h-7 w-7" />
  </PaginationLink>
);
PaginationLast.displayName = 'PaginationLast';

const PaginationFirst = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>): JSX.Element => (
  <PaginationLink
    aria-label="Go to first page"
    className={cn('gap-1 pr-2.5 h-11 w-11', className)}
    {...props}
  >
    <ChevronsLeft className="h-7 w-7" />
  </PaginationLink>
);
PaginationFirst.displayName = 'PaginationFirst';

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<'span'>): JSX.Element => (
  <span
    aria-hidden
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = 'PaginationEllipsis';

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLast,
  PaginationFirst,
  PaginationEllipsis,
};
