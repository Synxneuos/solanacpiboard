/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0b0e',
        surface: '#12141a',
        surfaceHover: '#181b24',
        border: '#1f2430',
        solana: {
          purple: '#9945FF',
          green: '#14F195',
          cyan: '#00C2FF',
        }
      }
    },
  },
  plugins: [],
};
