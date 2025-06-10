/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5B5CFF',
        secondary: '#8B8DFF',
        accent: '#FF6B6B',
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        },
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336',
        info: '#2196F3'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui']
      },
      animation: {
        'checkbox-fill': 'checkbox-fill 200ms ease-out',
        'task-complete': 'task-complete 400ms ease-out',
        'priority-pulse': 'priority-pulse 2s infinite',
        'card-slide-in': 'card-slide-in 300ms ease-out'
      },
      keyframes: {
        'checkbox-fill': {
          '0%': { transform: 'scale(0)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' }
        },
        'task-complete': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '25%': { transform: 'scale(0.98)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '0.6' }
        },
        'priority-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' }
        },
        'card-slide-in': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}