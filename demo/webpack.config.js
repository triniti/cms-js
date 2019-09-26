const dotenv = require('dotenv');
const webpack = require('webpack');
const { resolve } = require('path');

/**
 * This block of code grabs the .env variables and overwrites them
 * with any environment variables set.
 *
 * @param {Object} webpackEnv
 *
 * @return {Object}
 */
const compileEnvVars = (webpackEnv) => Object.entries(process.env).reduce((acc, pair) => {
  const [key, value] = pair;
  if (typeof acc[key] === 'undefined') {
    return acc;
  }

  acc[key.toUpperCase()] = value;
  return acc;
}, { NODE_ENV: 'development',
  APP_BASE_URL: '/',
  ASSET_PATH: '/',
  ...webpackEnv,
  ...dotenv.config().parsed });

module.exports = (webpackEnv = {}) => {
  const env = compileEnvVars(webpackEnv);
  return {
    context: `${__dirname}/src`,
    entry: {
      javascript: './index.jsx',
      html: './index.html',
    },
    resolve: {
      extensions: ['*', '.js', '.jsx', '.json'],
    },
    devServer: {
      port: 3000,
      https: true,
      hot: true,
      // contentBase: resolve(__dirname, 'public'),
      watchOptions: {
        ignored: /\/node_modules\/.*/,
      },
    },
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loaders: ['babel-loader'],
        },
        {
          test: /\.svg$/,
          use: [
            'raw-loader',
          ],
        },
        {
          test: /\.html$/,
          loaders: ['file-loader?name=[name].[ext]'],
        },
        {
          test: /\.css$/,
          loader: [
            'style-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                config: {
                  path: resolve(__dirname, 'postcss.config.js'),
                },
              },
            },
          ],
        },
        {
          test: /\.scss$/,
          resolve: {
            extensions: ['.scss', '.sass'],
          },
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
              options: {
                importLoaders: 3,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                config: {
                  path: resolve(__dirname, 'postcss.config.js'),
                },
              },
            },
            {
              loader: 'sass-loader',
            },
            {
              loader: 'sass-resources-loader',
              options: {
                resources: resolve(__dirname, 'src/assets/styles/_variables.scss'),
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin(Object.entries(env).reduce((acc, pair) => {
        const [key, value] = pair;
        acc[key] = JSON.stringify(value);
        return acc;
      }, {})),
    ],
    output: {
      filename: '[name].js',
      path: `${__dirname}/dist`,
    },
  };
};
