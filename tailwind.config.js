/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        civic: {
          50: '#eef8ff',
          100: '#d9efff',
          200: '#bce3ff',
          300: '#84cdff',
          400: '#3eb0ff',
          500: '#1570ef',
          600: '#175cd3',
          700: '#1849a9',
          800: '#15367a',
          900: '#102a56'
        },
        saffron: '#f59e0b',
        mint: '#10b981'
      },
      boxShadow: {
        glow: '0 20px 80px rgba(21, 112, 239, 0.20)'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
