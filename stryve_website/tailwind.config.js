/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        carbon: {
          DEFAULT: '#0A0C10',
          900: '#07080B',
          800: '#0E1116',
          700: '#141922',
          600: '#1B212C',
        },
        chalk: {
          DEFAULT: '#F4F6F5',
          dim: '#C7CDD2',
        },
        pulse: {
          DEFAULT: '#FF4127',
          soft: '#FF6B54',
        },
        ion: {
          DEFAULT: '#31E7E0',
          soft: '#7DF3EE',
        },
        slate: {
          DEFAULT: '#7A828C',
          light: '#9AA2AC',
          dark: '#3A4049',
        },
      },
      fontFamily: {
        display: ['"Archivo"', 'system-ui', 'sans-serif'],
        sans: ['"Archivo"', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.045em',
      },
      maxWidth: {
        content: '1320px',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
        dash: {
          to: { strokeDashoffset: '0' },
        },
        'signal-flow': {
          '0%': { strokeDashoffset: '200' },
          '100%': { strokeDashoffset: '0' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
