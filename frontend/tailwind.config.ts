import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        /* Primary */
        primary: '#2563eb',
        'primary-dark': '#1d4ed8',
        'primary-light': '#60a5fa',

        /* Semantic */
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#3b82f6',

        /* Neutrals - light/dark variants */
        background: '#ffffff',
        'background-dark': '#0f172a',
        surface: '#f8fafc',
        'surface-dark': '#1e293b',
        border: '#e2e8f0',
        'border-dark': '#334155',
        text: '#1e293b',
        'text-dark': '#f1f5f9',

        /* Legacy CSS variable tokens (kept for compatibility) */
        borderVar: 'hsl(var(--border))',
        inputVar: 'hsl(var(--input))',
        ringVar: 'hsl(var(--ring))',
        foregroundVar: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },

      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial'],
      },

      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
      },

      boxShadow: {
        sm: '0 1px 2px rgba(2,6,23,0.06)',
        md: '0 4px 10px rgba(2,6,23,0.08)',
        lg: '0 10px 30px rgba(2,6,23,0.12)',
      },

      transitionDuration: {
        150: '150ms',
        300: '300ms',
        500: '500ms',
      },

      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-in-down': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        },
      },

      animation: {
        'fade-in': 'fade-in 300ms ease-out',
        'slide-in-up': 'slide-in-up 300ms ease-out',
        'slide-in-down': 'slide-in-down 300ms ease-out',
        'slide-in-left': 'slide-in-left 300ms ease-out',
        'slide-in-right': 'slide-in-right 300ms ease-out',
        'scale-in': 'scale-in 300ms ease-out',
        'pulse-subtle': 'pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounce-subtle 1s ease-in-out infinite',
      },

      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 0deg, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}

export default config