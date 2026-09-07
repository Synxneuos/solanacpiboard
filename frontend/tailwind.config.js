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
        background: '#0B0F19',
        surface: '#111827',
        surfaceHover: '#172033',
        border: '#1F293D',
        slateMuted: '#94A3B8',
        solana: {
          purple: '#8B5CF6',
          green: '#10B981',
          cyan: '#06B6D4',
        }
      }
    },
  },
  plugins: [],
};
