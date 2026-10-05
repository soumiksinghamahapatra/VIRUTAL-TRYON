/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        maison: {
          50: '#FFFFFF',
          100: '#FAFAFA',
          200: '#F5F5F5',
          300: '#EEEEEE',
          400: '#E0E0E0',
          500: '#9E9E9E',
          600: '#616161',
          700: '#424242',
          800: '#212121',
          900: '#000000',
        },
        aura: {
          50: '#FFFFFF',
          100: '#FAFAFA',
          200: '#F5F5F5',
          300: '#E5E5E5',
          400: '#D4D4D4',
          500: '#737373',
          600: '#525252',
          700: '#262626',
          800: '#171717',
          900: '#000000',
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
