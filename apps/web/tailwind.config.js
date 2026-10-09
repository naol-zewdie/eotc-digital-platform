/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dd: {
          bg: '#F7F5F0',
          dark: '#201F1E',
          text: '#201F1E',
          accent: '#C89D3C',
          muted: '#5C5A56',
          card: '#FAF9F6',
          border: 'rgba(32, 31, 30, 0.12)',
        },
        sacred: {
          gold: '#C89D3C',
          brass: '#B58B2F',
          dark: '#201F1E',
          cream: '#F7F5F0',
          parchment: '#FAF9F6',
        },
      },
      fontFamily: {
        serif: ['"Instrument Serif"', '"Cinzel"', '"Noto Serif Ethiopic"', 'serif'],
        sans: ['"Inter"', '"Noto Sans Ethiopic"', 'sans-serif'],
        mono: ['"Roboto Mono"', 'monospace'],
        ethiopic: ['"Noto Sans Ethiopic"', 'Nyala', 'Abyssinica SIL', 'sans-serif'],
      },
      animation: {
        'marquee-left': 'marqueeLeft 35s linear infinite',
        'marquee-right': 'marqueeRight 35s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        marqueeLeft: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        marqueeRight: {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      },
    },
  },
  plugins: [],
};
