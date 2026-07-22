/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        idealy: {
          // Deep greens used for the balance card, header and drawer
          green: '#0F3D2E',
          'green-dark': '#0A2A20',
          'green-light': '#1B5C42',
          // Metallic gold used for the logo, accents and highlights
          gold: '#D4AF37',
          'gold-light': '#F0C93B',
          'gold-dark': '#A9841F',
          // App surfaces
          bg: '#F7F8FA',
          card: '#FFFFFF',
          // Text
          text: '#1A1F1C',
          muted: '#6B7280',
          // Bento accent colors (income / expense / savings / budgets / bazary / ai)
          income: '#16A34A',
          'income-bg': '#E5F5EC',
          expense: '#E11D48',
          'expense-bg': '#FCE7ED',
          savings: '#2563EB',
          'savings-bg': '#E3EEFC',
          budgets: '#C9971C',
          'budgets-bg': '#FBF0D9',
          bazary: '#8B5CF6',
          'bazary-bg': '#F1E8FB',
          ai: '#0F9D74',
          'ai-bg': '#E5F5EC',
        },
      },
      fontFamily: {
        display: ['System'],
      },
    },
  },
  plugins: [],
};
