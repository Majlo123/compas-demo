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
        disabled: '#999999'
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
        'button': '10px',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.placeholder-up::placeholder': {
          transform: 'translateY(-3px)',
          display: 'inline-block',
        },
      });
    },
  ],
};

export default config;
