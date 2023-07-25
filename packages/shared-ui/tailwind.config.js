const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html,css}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        boldy: '#1a1c20',
        primary: '#202225',
        secondary: '#5865F2',
        tertiary: '#2A3849',
        // accent: 'rgb(217, 119, 6)',
        'accent-hover': '#b06F00',
      },
    },
  },
  plugins: [],
};
