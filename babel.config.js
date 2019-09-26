const { resolve } = require('path');

const env = process.env.BABEL_ENV || 'test';
const root = resolve(__dirname);

const presets = [
  '@babel/preset-react',
];

const plugins = [
  [
    'babel-plugin-module-resolver',
    {
      root: ['./src'],
      alias: {
        '@triniti/cms': `${root}/src`,
      },
    },
  ],
  '@babel/plugin-syntax-dynamic-import',
  '@babel/plugin-transform-async-to-generator',
  ['@babel/plugin-proposal-class-properties', { loose: false }],
  '@babel/plugin-proposal-object-rest-spread',
  ['@babel/plugin-transform-runtime', { regenerator: true }],
  'react-hot-loader/babel',
];

switch (env) {
  case 'cjs':
    presets.push([
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
        modules: 'commonjs',
        useBuiltIns: 'usage',
        corejs: '3.0.0',
      },
    ]);
    break;

  case 'es6':
    presets.push([
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
        modules: false,
        useBuiltIns: 'usage',
        corejs: '3.0.0',
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

/*
 * When an app (e.g. apps/cms/) is running and it uses a package in the
 * packages/* directory it will first load its .babelrc.js, then traverse
 * and load root .babelrc.js, then do this for every package in packages/*.
 *
 * Oh Oh it's magic.  black, horrific, satanic magic.
 */
if (process.cwd() !== __dirname) {
  module.exports = require(`${process.cwd()}/.babelrc.js`);
}
