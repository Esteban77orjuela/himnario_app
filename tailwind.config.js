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
          DEFAULT: '#F8FAFC',
          dark: '#0D0D10',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#18181B',
        },
        'surface-elevated': {
          DEFAULT: '#FFFFFF',
          dark: '#212124',
        },
        primary: {
          DEFAULT: '#FF8C00',
          dark: '#D88F2E',
        },
        'primary-light': {
          DEFAULT: '#FFB74D',
          dark: '#F0C27A',
        },
        accent: {
          DEFAULT: '#FF6B00',
          dark: '#F0B04C',
        },
        text: {
          DEFAULT: '#1E293B',
          dark: '#EDE4DC',
        },
        muted: {
          DEFAULT: '#94A3B8',
          dark: '#A8988A',
        },
        border: {
          DEFAULT: '#F1F5F9',
          dark: '#27272A',
        },
        warm: {
          DEFAULT: '#FFF8F3',
          dark: '#141417',
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
