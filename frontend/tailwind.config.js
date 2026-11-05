/** @type {import('tailwindcss').Config} */

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],

  theme: {
    extend: {
      colors: {
        gold: {
          300: '#F6D77A',
          400: '#EBC04F',
          500: '#D6A52E',
          600: '#A77A18',
        },

        ink: {
          950: '#090A09',
          900: '#101210',
          850: '#151815',
          800: '#1B1F1B',
          700: '#252A25',
        },
      },
    },
  },

  plugins: [],
}