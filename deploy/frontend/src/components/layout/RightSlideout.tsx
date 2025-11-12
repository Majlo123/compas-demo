import { forwardRef } from 'react';

import classNameBuilder from '@/utils/classNameBuilder';

type SlideoutProps = {
  className?: string;
  isOpen: boolean;
  children?: React.ReactNode;
};

const RightSlideout = forwardRef<HTMLElement, SlideoutProps>(
  ({ isOpen, children, className }, ref) => {
    return (
      <div>
        <div
          className={classNameBuilder(
            'overlay',
            isOpen && 'fixed inset-0 z-100 bg-darkGrey bg-opacity-30'
          )}
        />
        <section
          ref={ref}
          className={classNameBuilder(
            className,
            'right-slideout',
            'fixed top-0 right-0 z-101 h-full w-fit min-w-[600px]',
            'transition-transform duration-300 ease-in-out',
            isOpen ? 'translate-x-0' : 'translate-x-full',
            'bg-white shadow-lg border-l border-grey95'
          )}
        >
          {Boolean(isOpen) && children}
        </section>
      </div>
    );
  }
);

RightSlideout.displayName = 'RightSlideout';

export default RightSlideout;
