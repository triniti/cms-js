const presets = [
  '@babel/preset-react',
  [
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
  ]
];

const plugins = [
  '@babel/plugin-proposal-export-default-from',
];

module.exports = {
  presets,
  plugins,
};
