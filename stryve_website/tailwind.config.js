/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // CARBON — warm graphite black, tuned to sit under cream + pulse
        carbon: {
          DEFAULT: '#0B0A09',
          950: '#070605',
          900: '#0B0A09',
          800: '#131110',
          700: '#1B1817',
          600: '#252120',
          500: '#312C29',
        },
        // CHALK — exact value sampled from the STRYVE wordmark
        chalk: {
          DEFAULT: '#F2EBE0',
          dim: '#B8AFA4',
        },
        // PULSE — exact value sampled from the STRYVE logo mark
        pulse: {
          DEFAULT: '#FF421D',
          soft: '#FF6B4A',
          deep: '#C72E11',
        },
        // ION — data / technology accent
        ion: {
          DEFAULT: '#31E7E0',
          soft: '#7DF3EE',
        },
        // SLATE — warm neutral support
        slate: {
          DEFAULT: '#8A8078',
          light: '#A79D93',
          dark: '#3A3532',
        },
      },
      fontFamily: {
        display: ['"Archivo Black"', 'Archivo', 'system-ui', 'sans-serif'],
        sans: ['Archivo', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: { tightest: '-0.04em' },
      maxWidth: { content: '1340px' },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
        'scan-y': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(200%)' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
