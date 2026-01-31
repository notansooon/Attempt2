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
        primary: {
          50: '#fdf4f6',
          100: '#fce8ed',
          200: '#f9d5df',
          300: '#f4b4c4',
          400: '#ec8aa3',
          500: '#df6183',
          600: '#cb4266',
          700: '#ab3352',
          800: '#8f2d47',
          900: '#792a40',
          950: '#43131f',
        },
        secondary: {
          50: '#f5f7fa',
          100: '#ebeef3',
          200: '#d3dae4',
          300: '#acbacf',
          400: '#8094b5',
          500: '#5f779d',
          600: '#4c6083',
          700: '#3e4e6b',
          800: '#36435a',
          900: '#313a4c',
          950: '#202633',
        },
        calm: {
          50: '#f0fdf9',
          100: '#ccfbec',
          200: '#99f6db',
          300: '#5dead0',
          400: '#2cd4bd',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766d',
          800: '#115e57',
          900: '#134e48',
          950: '#042f2e',
        },
      },
    },
  },
  plugins: [],
};

export default config;
