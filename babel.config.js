const { resolve } = require('path');

const env = process.env.BABEL_ENV || 'browser';
const root = resolve(__dirname, '');

const presets = [
  '@babel/preset-react',
];

const plugins = [
  [
    'babel-plugin-module-resolver',
    {
      // root: [`${root}/src`],
      alias: {
        //'@some/path/Example': `${root}/src/path/Example`,
        // '@triniti/cms': `${root}/src`,
      },
    },
  ],
  [
    'babel-plugin-transform-builtin-extend',
    {
      globals: ['Error'],
    },
  ],
  [
    '@babel/plugin-proposal-class-properties',
    {
      loose: false,
    },
  ],
  '@babel/plugin-proposal-export-default-from',
  '@babel/plugin-proposal-object-rest-spread',
  '@babel/plugin-syntax-dynamic-import',
  '@babel/plugin-transform-async-to-generator',
  '@babel/plugin-transform-regenerator',
  '@babel/plugin-transform-runtime',
];

switch (env) {
  case 'cjs':
  case 'test':
    presets.push([
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
        modules: 'commonjs',
        useBuiltIns: 'usage',
        corejs: 3,
      },
    ]);

    plugins.push('@babel/plugin-transform-modules-commonjs');
    break;

  case 'browser':
  default:
    presets.push([
      '@babel/preset-env',
      {
        targets: {
          browsers: [
            'last 2 versions',
          ],
        },
        modules: false,
        useBuiltIns: 'usage',
        corejs: 3,
      },
    ]);

    break;
}

module.exports = {
  presets,
  plugins,
};
