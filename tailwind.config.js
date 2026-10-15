/** @type {import('tailwindcss').Config} */
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: v('bg'),
        surface: v('surface'),
        raised: v('raised'),
        line: v('line'),
        fg: v('fg'),
        muted: v('muted'),
        accent: { DEFAULT: v('accent'), soft: v('accent-soft') },
        lime: '#C6F432',
        coral: '#FF6B6B',
        sky: '#5CC8FF',
      },
      fontFamily: {
        display: ['Sora', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgb(var(--accent) / .25), 0 12px 40px -12px rgb(var(--accent) / .45)',
      },
    },
  },
  plugins: [],
}
