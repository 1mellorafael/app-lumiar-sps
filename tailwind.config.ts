import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf9',
          100: '#dcfaf3',
          200: '#b9f3e8',
          300: '#85e7d5',
          400: '#4dd4bf',
          500: '#0F6E5C',
          600: '#0d5c4a',
          700: '#0b4a39',
          800: '#083a2c',
          900: '#062a21',
        },
        secondary: {
          50: '#fef4f0',
          100: '#fde4d9',
          200: '#fac9af',
          300: '#f6a57d',
          400: '#f08254',
          500: '#C97B4A',
          600: '#b86937',
          700: '#9d5429',
          800: '#7d3f1f',
          900: '#632d17',
        },
        neutral: {
          text: '#4A4A48',
          bg: '#F5F3EF',
        },
        success: '#25D366',
        error: '#B4442E',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      spacing: {
        0: '0px',
        1: '8px',
        2: '16px',
        3: '24px',
        4: '32px',
        5: '40px',
        6: '48px',
        7: '56px',
        8: '64px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config
