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
        eotc: {
          gold: {
            DEFAULT: '#D4AF37',
            light: '#F3E5AB',
            dark: '#AA820A',
          },
          crimson: {
            DEFAULT: '#7A1B1B',
            light: '#9E2A2B',
            dark: '#541010',
          },
          forest: {
            DEFAULT: '#1B4D3E',
            light: '#2E6F5B',
            dark: '#0F3025',
          },
          parchment: {
            DEFAULT: '#FBF9F4',
            dark: '#141619',
          },
        },
      },
      fontFamily: {
        ethiopic: ['"Noto Sans Ethiopic"', 'Nyala', 'Abyssinica SIL', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
