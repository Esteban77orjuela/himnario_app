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
          dark: '#0F1A18',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#1A2E2C',
        },
        'surface-elevated': {
          DEFAULT: '#FFFFFF',
          dark: '#243836',
        },
        primary: {
          DEFAULT: '#FF8C00',
          dark: '#D88F2E',
        },
        accent: {
          DEFAULT: '#FF6B00',
          dark: '#F0B04C',
        },
        text: {
          DEFAULT: '#1E293B',
          dark: '#F1E4DB',
        },
        muted: {
          DEFAULT: '#94A3B8',
          dark: '#A8938A',
        },
        border: {
          DEFAULT: '#F1F5F9',
          dark: '#2A3E3C',
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
