/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#090d16',
        cardBg: '#111827',
        brandBlue: '#06B6D4',
        neonCyan: '#00d4ff',
      }
    },
  },
  plugins: [],
}