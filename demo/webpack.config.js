const dotenv = require('dotenv');
const webpack = require('webpack');

/**
 * This block of code grabs the .env variables and overwrites them
 * with any environment variables set.
 *
 * @param {Object} webpackEnv
 *
 * @return {Object}
 */
const compileEnvVars = webpackEnv => Object.entries(process.env).reduce((acc, pair) => {
  const [key, value] = pair;
  if (typeof acc[key] === 'undefined') {
    return acc;
  }

  acc[key.toUpperCase()] = value;
  return acc;
}, Object.assign({
  NODE_ENV: 'development',
  APP_BASE_URL: '/',
  ASSET_PATH: '/',
}, webpackEnv, dotenv.config().parsed));

module.exports = (webpackEnv = {}) => {
  const env = compileEnvVars(webpackEnv);
  return {
    context: __dirname + "/src",
    entry: {
      javascript: './index.jsx',
      html: './index.html',
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loaders: ['babel-loader'],
        },
        {
          test: /\.html$/,
          loaders: ['file-loader?name=[name].[ext]'],
        }
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
      filename: "[name].js",
      path: __dirname + "/dist",
    },
  };
}
