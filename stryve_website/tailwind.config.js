/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /* CARBON — instrument-grade graphite black. Cool-neutral so the warm
           brand cream and pulse orange read as light *inside* a dark machine. */
        carbon: {
          DEFAULT: '#0A0B0D',
          950: '#060708',
          900: '#0A0B0D',
          800: '#101216',
          700: '#171A1F',
          600: '#20242A',
          500: '#2B3039',
        },
        /* CHALK — sampled from the STRYVE wordmark */
        chalk: {
          DEFAULT: '#F2EBE0',
          dim: '#A9AEB5',
        },
        /* PULSE — sampled from the STRYVE logo mark */
        pulse: {
          DEFAULT: '#FF421D',
          soft: '#FF6B4A',
          deep: '#C42D0F',
        },
        /* ION — controlled data / AI accent. Used sparingly. */
        ion: {
          DEFAULT: '#3BE0CF',
          soft: '#7CEFE3',
          deep: '#189E92',
        },
        slate: {
          DEFAULT: '#6E757E',
          light: '#98A0AA',
          dark: '#333941',
        },
      },
      fontFamily: {
        /* Archivo variable — width axis drives the condensed display voice */
        display: ['Archivo', 'system-ui', 'sans-serif'],
        sans: ['Archivo', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.045em',
        tighter2: '-0.03em',
      },
      maxWidth: { content: '1380px' },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        sweep: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 2.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
