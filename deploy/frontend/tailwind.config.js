import tailwindFormPlugin from '@tailwindcss/forms';
import plugin from 'tailwindcss/plugin';

const config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1E88E5',
        'primary-hover': '#0675DB',
        secondary: '#0883F2',
        // TODO: Need name for color
        pureBlack: '#000000',
        // TODO: Need name for color
        someGrey: '#B2B8B2',
        darkBlue: '#131428',
        blue: '#4991BC',
        lightBlueGrey: '#DEE6EA',
        teal: '#62BEAC',
        lightGrey: '#F4F4F4',
        white: '#FFFFFF',
        grey95: '#F2F2F2',
        darkGrey: '#282828',
        grey: '#E1E1E1',
        veryLightGrey: '#F2F2F2',
        ghostWhite: '#F8FAFB',
        // TODO: Need name for color
        unknownColor: '#DDDDDD',
        red: '#FF0000',
        green: '#22BB33',
        needBetterNameGrey: '#F7F7F7',
        // Layout colors
        layoutBg: '#F9FAFD',
        headerBg: '#FEFEFE',  
        headerBorder: '#F2F3F7',
        // Sidebar colors
        sidebarNavHover: 'rgba(255, 255, 255, 0.1)',
        sidebarNavActive: 'rgba(255, 255, 255, 0.2)',
        sidebarBorder: 'rgba(255, 255, 255, 0.1)',
        sidebarText: 'rgba(255, 255, 255, 0.8)',
        sidebarFooterBg: 'rgba(255, 255, 255, 0.2)',
      },
      fontFamily: {
        sans: ['Nunito', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        h1: [
          '24px',
          { lineHeight: '32px', letterSpacing: '0', fontWeight: '700' },
        ],
        h2: [
          '22px',
          { lineHeight: '100%', letterSpacing: '0', fontWeight: '700' },
        ],
        h3: [
          '20px',
          { lineHeight: '100%', letterSpacing: '0', fontWeight: '500' },
        ],
        h4: [
          '16px',
          { lineHeight: '100%', letterSpacing: '0', fontWeight: '600' },
        ],
        h5: [
          '14px',
          { lineHeight: '100%', letterSpacing: '0', fontWeight: '600' },
        ],
        p1: [
          '16px',
          { lineHeight: '100%', letterSpacing: '0', fontWeight: '400' },
        ],
        p2: [
          '14px',
          { lineHeight: '100%', letterSpacing: '0', fontWeight: '400' },
        ],
      },
      padding: {
        sm : '8px',
        md : '16px',
        lg : '24px',
        xl : '32px',
      },
      margin: {
        sm : '8px',
        md : '16px',
        lg : '24px',
        xl : '32px',
      },
      borderRadius: {
        'button': '10px',
      },
      height: {
        'button-sm': '32px',
        'button-md': '42px',
        'button-lg': '48px',
      },
      width: {
        'button-large': '450px',
      },
    },
  },
  safelist: [
    {
      pattern:
        /^(bg-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ['hover', 'ui-selected'],
    },
    {
      pattern:
        /^(text-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ['hover', 'ui-selected'],
    },
    {
      pattern:
        /^(border-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ['hover', 'ui-selected'],
    },
    {
      pattern:
        /^(ring-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
    {
      pattern:
        /^(stroke-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
    {
      pattern:
        /^(fill-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
  ],
  plugins: [
    tailwindFormPlugin,
    plugin(({ addComponents, theme }) => {
      const components = {};

      const hoverCircleSizes = [4, 6, 8, 10, 12, 14, 16, 20, 24];
      hoverCircleSizes.forEach((s) => {
        components[`.hoverCircle-${s}`] = {
          display: 'flex',
          'align-items': 'center',
          'justify-content': 'center',
          width: theme('spacing')[s],
          height: theme('spacing')[s],
          'border-radius': '50%',
          '&:hover': {
            'background-color': theme('colors.grey'),
          },
        };
      });

      const hoverPillSizes = [2, 4, 6, 8, 10, 12, 14, 16, 20, 24];
      hoverPillSizes.forEach((r) => {
        components[`.hoverPill-${r}`] = {
          display: 'flex',
          'align-items': 'center',
          'justify-content': 'center',
          'border-radius': theme('spacing')[r],
          '&:hover': { 'background-color': theme('colors.grey') },
        };
      });

      addComponents(components);
    }),
  ],
};

export default config;
