/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bebas Neue"', 'Impact', 'sans-serif'],
        mono: ['"DM Mono"', '"Courier New"', 'monospace'],
      },
      colors: {
        bg: 'var(--bg)',
        'bg-2': 'var(--bg-2)',
        'bg-3': 'var(--bg-3)',
        amber: 'var(--amber)',
        'amber-dim': 'var(--amber-dim)',
        white: 'var(--white)',
        muted: 'var(--muted)',
        teal: 'var(--teal)',
        'teal-light': 'var(--teal-light)',
        border: 'var(--border)',
      },
    },
  },
  plugins: [],
}
