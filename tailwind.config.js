/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        giftoria: {
          wine: {
            50: '#FDF2F4',
            100: '#FBE4E8',
            200: '#F7CBD3',
            300: '#F0A3B2',
            400: '#E47189',
            500: '#D24564',
            600: '#B82E4D',
            700: '#9B213E',
            800: '#6B1D2F', // Primary Burgundy/Wine
            900: '#581424',
            950: '#3D0A16',
          },
          cream: {
            50: '#FFFFFF',
            100: '#FDFBF7', // Secondary Warm Cream
            200: '#F8F4EC',
            300: '#F3EDE2',
            400: '#E8DCCB',
            500: '#D9C6B0',
          },
          gold: {
            50: '#FDFCF5',
            100: '#FAF7E3',
            200: '#F3EBC0',
            300: '#EADC94',
            400: '#E0CA60',
            500: '#D4AF37', // Accent Muted Gold
            600: '#C5A028',
            700: '#A17E1A',
            800: '#826319',
          },
          charcoal: {
            50: '#F4F5F4',
            100: '#E2E4E3',
            200: '#C4C8C6',
            300: '#9EA4A1',
            400: '#757C79',
            500: '#5A615E',
            600: '#474D4A',
            700: '#3A3F3D',
            800: '#2D322F',
            900: '#1F2421', // Dark Charcoal Support
            950: '#121614',
          },
          bg: '#FAF8F5',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(107, 29, 47, 0.08)',
        'card': '0 10px 30px -5px rgba(0, 0, 0, 0.05)',
        'gold': '0 4px 15px -1px rgba(212, 175, 55, 0.25)',
        'wine': '0 6px 20px -2px rgba(107, 29, 47, 0.25)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
};
