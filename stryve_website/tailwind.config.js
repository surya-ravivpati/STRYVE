/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /* CARBON — instrument-grade graphite black, matched to the PowerThru
           mark. Cool-neutral so chalk and PowerThru blue read as light
           *inside* a dark machine. */
        carbon: {
          DEFAULT: '#0A0B0D',
          950: '#060708',
          900: '#0A0B0D',
          800: '#101216',
          700: '#171A1F',
          600: '#20242A',
          500: '#2B3039',
        },
        /* CHALK — light type and the PowerThru mark/wordmark on dark */
        chalk: {
          DEFAULT: '#F2EBE0',
          dim: '#A9AEB5',
        },
        /* PULSE — PowerThru blue, sampled from the drive-bar in the mark.
           The single brand accent: CTAs, the mark, live signal. */
        pulse: {
          DEFAULT: '#0B6CFF',
          soft: '#3D8BFF',
          deep: '#0052CC',
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
