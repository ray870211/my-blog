/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class', // 使用 class 策略
  theme: {
    extend: {
      colors: {
        // 自定義暗色模式顏色
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      backgroundImage: {
        'night-gradient': 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        'day-gradient': 'linear-gradient(180deg, #87ceeb 0%, #e6f3ff 50%, #ffffff 100%)',
      }
    },
  },
  plugins: [],
}