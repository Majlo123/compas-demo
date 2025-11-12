import { ComponentPropsWithoutRef } from 'react';

import SVGComponentProps from '@/components/images/svg-component-props';

export type ButtonWithIcon = ComponentPropsWithoutRef<'button'> & {
  Icon: React.FC<SVGComponentProps>;
  iconClassName?: string;
};

export type ButtonWithoutIcon = ComponentPropsWithoutRef<'button'> & {
  Icon?: undefined;
  iconClassName?: never;
};
