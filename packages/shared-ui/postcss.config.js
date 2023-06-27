const { join } = require('path');
const postcssPresetEnv = require('postcss-preset-env');
const tailwindcss = require('tailwindcss');

// Note: If you use library-specific PostCSS/Tailwind configuration then you should remove the `postcssConfig` build
// option from your application's configuration (i.e. project.json).
//
// See: https://nx.dev/guides/using-tailwind-css-in-react#step-4:-applying-configuration-to-libraries

module.exports = {
  plugins: {
    'postcss-import': {},
    // 'tailwindcss/nesting': 'postcss-nesting',
    'postcss-preset-env': postcssPresetEnv({
      stage: 3,
      features: {
        'nesting-rules': true
      },
    }),
    tailwindcss: {
      config: join(__dirname, 'tailwind.config.js'),
    },
    autoprefixer: {},
  },
};
