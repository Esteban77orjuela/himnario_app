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
          dark: '#020617', // Very deep slate, almost black
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#0F172A',
        },
        primary: {
          DEFAULT: '#4F46E5', // Indigo 600
          dark: '#818CF8',    // Indigo 400
        },
        accent: {
          DEFAULT: '#EC4899', // Pink 500
          dark: '#F472B6',    // Pink 400
        },
        text: {
          DEFAULT: '#0F172A',
          dark: '#F8FAFC',
        },
        muted: {
          DEFAULT: '#64748B',
          dark: '#94A3B8',
        }
      }
    },
  },
  plugins: [],
};
