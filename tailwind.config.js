/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';

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
        },
        // 星空主題色彩
        star: {
          gold: '#fbbf24', // 星光金
          silver: '#e5e7eb', // 銀河銀
          cyan: '#38bdf8', // 青星藍
          nebula: '#a855f7', // 星雲紫
          rose: '#f43f5e', // 玫瑰星雲
          emerald: '#10b981', // 翡翠星
          amber: '#f59e0b', // 琥珀星
          indigo: '#6366f1', // 靛藍星系
        }
      },
      backgroundImage: {
        'night-gradient': 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        'day-gradient': 'linear-gradient(180deg, #87ceeb 0%, #e6f3ff 50%, #ffffff 100%)',
        'starlight-gradient': 'linear-gradient(135deg, #38bdf8 0%, #fbbf24 50%, #38bdf8 100%)',
        'nebula-gradient': 'linear-gradient(135deg, #a855f7 0%, #f43f5e 50%, #10b981 100%)',
      },
      animation: {
        'star-twinkle': 'twinkle 3s ease-in-out infinite',
        'star-glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px currentColor' },
          '100%': { boxShadow: '0 0 20px currentColor, 0 0 30px currentColor' },
        }
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.dark[300]'),
            '--tw-prose-headings': theme('colors.dark[100]'),
            '--tw-prose-lead': theme('colors.dark[400]'),
            '--tw-prose-links': theme('colors.star.cyan'),
            '--tw-prose-bold': theme('colors.dark[100]'),
            '--tw-prose-counters': theme('colors.dark[400]'),
            '--tw-prose-bullets': theme('colors.dark[600]'),
            '--tw-prose-hr': theme('colors.dark[700]'),
            '--tw-prose-quotes': theme('colors.dark[100]'),
            '--tw-prose-quote-borders': theme('colors.dark[600]'),
            '--tw-prose-captions': theme('colors.dark[400]'),
            '--tw-prose-code': theme('colors.star.silver'),
            '--tw-prose-pre-code': theme('colors.dark[200]'),
            '--tw-prose-pre-bg': 'rgba(15, 23, 42, 0.8)', // dark.900 with transparency
            '--tw-prose-th-borders': theme('colors.dark[500]'),
            '--tw-prose-td-borders': theme('colors.dark[700]'),
            
            // Base styles
            maxWidth: '80ch',
            
            a: {
              fontWeight: '500',
              textDecoration: 'none',
              transition: 'color 0.2s ease-in-out',
              '&:hover': {
                color: theme('colors.star.gold'),
                textDecoration: 'none',
              },
            },
            
            'h1, h2, h3': {
              fontWeight: '700',
              letterSpacing: theme('letterSpacing.tight'),
            },
            h1: {
              fontSize: '2.5em',
            },
            h2: {
              fontSize: '2em',
              marginTop: '1.75em',
              marginBottom: '0.75em',
            },
            h3: {
              fontSize: '1.5em',
              marginTop: '1.5em',
              marginBottom: '0.5em',
            },
            
            p: {
              lineHeight: '1.8',
            },

            blockquote: {
              paddingLeft: '1em',
              borderLeftWidth: '0.25rem',
              fontStyle: 'italic',
            },

            'pre code': {
              fontSize: '0.9em',
              borderRadius: theme('borderRadius.md'),
            }
          },
        },
      }),
    },
  },
  plugins: [typography],
}