const config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FECD00',
        secondary: '#333333',
        pureBlack: '#000000',
        surface: '#F8F8F8',
        indicator: '#131428',
        disabled: '#999999',
        status: {
          ok: '#76C29B',
          okBg: '#e8f5ef',
          triggered: '#D32F2F',
          triggeredBg: '#FFEBEE',
        },
        category: {
          alcoholic: '#6A1B9A',
          bread: '#8D6E63',
          cleaning: '#546E7A',
          coldBeverages: '#1976D2',
          confectionery: '#E91E63',
          crisps: '#FF9800',
          dairy: '#00ACC1',
          disposables: '#616161',
          fish: '#00796B',
          fruitVeg: '#388E3C',
          groceries: '#9C27B0',
          hotBeverages: '#F57C00',
          ice: '#3F51B5',
          meat: '#D32F2F',
          nonfood: '#795548',
          sandwiches: '#B8860B',
          savoury: '#FF7043',
          sweets: '#C2185B',
        },
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
          '12px',
          { lineHeight: '100%', letterSpacing: '0', fontWeight: '400' },
        ],
      },
      padding: {
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
      },
      margin: {
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
      },
      borderRadius: {
        button: '10px',
      },
    },
  },
};

export default config;
