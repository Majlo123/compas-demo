import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../tailwind.config';

const fullConfig = resolveConfig(tailwindConfig);

export const getLeaveTypeColor = (type: string): string => {
  const colors = fullConfig.theme.colors as any;
  switch (type) {
    case 'vacation':
      return colors['vacation-leave'];
    case 'sick':
      return colors['sick-leave'];
    case 'personal':
      return colors['personal-leave'];
    case 'other':
      return colors['other-leave'];
    default:
      return colors.primary;
  }
};
