const path = require('path');
const { templatesDir } = require('./engine');

module.exports = {
  framework: 'storybook-framework-template-engine',

  // this dirname is because we run tests from project root
  stories: ['../stories/**/*.stories.*'],
  logLevel: 'debug',
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-actions',
    '@storybook/addon-backgrounds',
    '@storybook/addon-controls',
    '@storybook/addon-jest',
    '@storybook/addon-links',
    {
      name: '@storybook/addon-postcss',
      options: {
        postcssLoaderOptions: {
          implementation: require('postcss'), // eslint-disable-line global-require
        },
      },
    },
    '@storybook/addon-storysource',
    '@storybook/addon-viewport',
  ],
  core: {
    builder: 'webpack4',
  },

  // Expose the templates so they can be requested at run-time
  staticDirs: [
    {
      from: `../src/${templatesDir}`,
      to: `/${templatesDir}`,
    },
  ],

  // Allow webpack to load the templates
  webpackFinal: async (config) => {
    config.module.rules.push(
      {
        test: /\.njk$/,
        use: require.resolve('raw-loader'),
      },
      {
        test: /\.liquid$/,
        use: [
          'html-loader',
          {
            loader: path.resolve(__dirname, 'lib/liquidLoader.js'),
          },
        ],
      }
    );

    return config;
  },

  // Test code for built-in stories.json extraction
  //
  // refs: {
  //   'react-ts': {
  //     title: 'React TS',
  //     // development
  //     url: 'http://localhost:9011',
  //     // production
  //     // url: 'http://localhost:8080',
  //   },
  // },
};
