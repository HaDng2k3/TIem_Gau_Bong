/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cozy-bg': '#FAF4EB',
        'cozy-card': '#FFFFFF',
        'cozy-text': '#6B4226',
        'cozy-primary': '#D47343',
        'cozy-secondary': '#E5A93C',
        'cozy-border': '#EAE0D5'
      },
      fontFamily: {
        'sans': ['Quicksand', 'sans-serif'],
        'handwriting': ['Caveat', 'cursive'],
      }
    },
  },
  plugins: [],
}
