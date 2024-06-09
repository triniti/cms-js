const env = process.env.BABEL_ENV || 'test';

const presets = [];
const plugins = ['@babel/plugin-proposal-export-default-from'];

switch (env) {
  case 'test':
    presets.push('@babel/preset-react');
    presets.push([
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
        modules: false,
        useBuiltIns: 'usage',
        corejs: 3,
      }
    ]);
    break;

  case 'build':
    plugins.push('@babel/plugin-syntax-jsx');
    break;
}

export default {
  presets,
  plugins,
};

