const { resolve } = require('path');

const env = process.env.BABEL_ENV || 'test';
const root = resolve(__dirname);

const presets = [
  '@babel/preset-react',
];

const plugins = [];

if (env !== 'build') {
  plugins.push([
    'babel-plugin-module-resolver',
    {
      root: ['./src'],
      alias: {
        '@triniti/cms': `${root}/src`,
      },
    },
  ]);
  plugins.push('react-hot-loader/babel');
}

[
  '@babel/plugin-syntax-dynamic-import',
  '@babel/plugin-transform-async-to-generator',
  [
    '@babel/plugin-proposal-class-properties',
    {
      loose: false,
    },
  ],
  '@babel/plugin-proposal-object-rest-spread',
  [
    '@babel/plugin-transform-runtime',
    {
      regenerator: true,
    },
  ],
].forEach((plugin) => plugins.push(plugin));

switch (env) {
  case 'test':
  case 'cjs':
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
    break;

  case 'build':
  case 'es6':
    presets.push([
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
        modules: false,
        useBuiltIns: 'usage',
        corejs: 3,
      },
    ]);

    plugins.push('lodash');
    plugins.push('./use-lodash-es');
    break;

  default:
    break;
}

module.exports = {
  presets,
  plugins,
};
