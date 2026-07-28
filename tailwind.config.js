/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'ps-orange': '#FFA300',
        'ps-dark': '#12161d',
        'ps-bg': '#f4f5f7',
        'ps-footer': '#101318',
        'ps-muted': '#5d6673',
        'ps-border': '#dfe3e8',
        'ps-summary': '#eef1f4',
      },
      fontFamily: {
        'ps': ['"Avenir Next"', 'Avenir', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
  // Disable preflight to avoid clashing with our ps- CSS reset
  // We only want Tailwind utility classes, not its opinionated base reset
  corePlugins: {
    preflight: false,
  },
}