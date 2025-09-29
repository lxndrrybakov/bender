/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f1f6ff',
          100: '#dce7ff',
          200: '#b7ceff',
          300: '#8bb0ff',
          400: '#5f92ff',
          500: '#3575ff',
          600: '#1b5ce6',
          700: '#1446b4',
          800: '#0d2f82',
          900: '#071951'
        }
      }
    }
  },
  plugins: []
};
