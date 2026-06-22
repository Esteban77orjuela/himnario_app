module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./index.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#F7F4F0',
          dark: '#0B0815',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#16112B',
        },
        'surface-elevated': {
          DEFAULT: '#FFFFFF',
          dark: '#1E1936',
        },
        primary: {
          DEFAULT: '#6D4FC6',
          dark: '#A78BFA',
        },
        accent: {
          DEFAULT: '#E04098',
          dark: '#F472B6',
        },
        text: {
          DEFAULT: '#1A1528',
          dark: '#F1F0F7',
        },
        muted: {
          DEFAULT: '#8B84A0',
          dark: '#9C96B8',
        },
        border: {
          DEFAULT: '#E8E4EC',
          dark: '#2A2444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'System'],
        serif: ['PlayfairDisplay', 'Georgia'],
        mono: ['monospace'],
      },
    },
  },
  plugins: [],
};
