const { resolve } = require('path');

const env = process.env.BABEL_ENV || 'cjs';
const root = resolve(`${__dirname}/../`);
const presets = [
  '@babel/preset-react',
];

const plugins = [
  [
    'babel-plugin-module-resolver',
    {
      root: [`${root}demo/src`],
      alias: {
        '@triniti/cms': `${root}/src`,
      },
    },
  ],
  // [
  //   'babel-plugin-transform-builtin-extend',
  //   {
  //     globals: ['Error']
  //   }
  // ],
  '@babel/plugin-syntax-dynamic-import',
  '@babel/plugin-transform-async-to-generator',
  '@babel/plugin-proposal-class-properties',
  ['@babel/plugin-proposal-decorators', { legacy: true }],
  '@babel/plugin-proposal-object-rest-spread',
  '@babel/plugin-transform-regenerator',
  '@babel/plugin-transform-runtime',
];

switch (env) {
  case 'browser':
    presets.push([
      '@babel/preset-env',
      {
        targets: {
          browsers: [
            'last 2 versions',
          ],
        },
        exclude: [
          'babel-plugin-transform-classes',
          '@babel/plugin-transform-classes',
        ],
        modules: false,
        corejs: '3.0.0',
      },
    ]);

    break;

  case 'cjs':
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
    break;

  default:
    break;
}

module.exports = {
  presets,
  plugins,
};
