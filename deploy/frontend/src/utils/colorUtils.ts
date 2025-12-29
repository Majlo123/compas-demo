import resolveConfig from 'tailwindcss/resolveConfig';

// eslint-disable-next-line no-restricted-imports
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

export const getTypeLabel = (type: string): string => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};
