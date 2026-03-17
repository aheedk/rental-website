import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C9A84C',
          light:   '#E8C97A',
          dark:    '#A07830',
          muted:   '#7A5C2E',
          faint:   '#2A2010',
        },
        dark: {
          DEFAULT: '#0D0D0D',
          100: '#141414',
          200: '#1A1A1A',
          300: '#222222',
          400: '#2A2A2A',
          500: '#333333',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans:  ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #A07830 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
