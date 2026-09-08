/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tiktok: {
          cyan: '#25F4EE',
          pink: '#FE2C55',
          dark: '#121212',
          card: '#1E1E24',
          border: '#2E2E38'
        }
      }
    },
  },
  plugins: [],
}
