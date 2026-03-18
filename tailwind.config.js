/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#ff8fb1',
          DEFAULT: '#ff2d75', // Brand pink
          dark: '#e01e63',
        },
        secondary: '#ffffff',
        accent: {
          light: '#f9fafb',
          DEFAULT: '#f3f4f6', // Soft gray
          dark: '#9ca3af',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 10px 30px -5px rgba(0, 0, 0, 0.05), 0 5px 15px -3px rgba(0, 0, 0, 0.02)',
      }
    },
  },
  plugins: [],
}
