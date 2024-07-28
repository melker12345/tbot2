export const content = [
  './src/**/*.{js,jsx,ts,tsx}',
];
export const theme = {
  extend: {
    keyframes: {
      scroll: {
        '0%': { transform: 'translateX(0)' },
        '100%': { transform: 'translateX(-50%)' },
      },
    },
    animation: {
      scroll: 'scroll 20s linear infinite',
    },
  },
};
export const plugins = [];
