/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#F8FCFF',
          border: '#D6EAF8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 12px rgba(56,189,248,0.08)',
        'card-hover': '0 8px 28px rgba(56,189,248,0.18)',
        'header': '0 2px 20px rgba(56,189,248,0.12)',
      },
    },
  },
  plugins: [],
};
