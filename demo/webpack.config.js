const dotenv = require('dotenv');
const { resolve } = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');


/**
 * @link https://webpack.js.org/configuration/
 *
 * @param {Object} env
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
}, {
  NODE_ENV: 'development',
  APP_BASE_URL: '/',
  ASSET_PATH: '/',
  ...webpackEnv,
  ...dotenv.config().parsed,
});

module.exports = (webpackEnv = {}) => {
  const env = compileEnvVars(webpackEnv);
  env['process.env.NODE_DEBUG'] = false;
  return {
    entry: {
      //'webpack-dev-server/client?https://localhost:3000',
      //'webpack/hot/only-dev-server',
      main: './main.jsx'
    },
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    devServer: {
      allowedHosts: 'all',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
      },
      historyApiFallback: true,
      port: 3000,
      server: {
        type: 'https',
      },
    },
    stats: 'normal',
    output: {
      path: `${resolve(__dirname, 'dist')}${env.ASSET_PATH}`,
      publicPath: '/',
      filename: '[name].js',
      chunkFilename: 'chunks/[name].js',
      pathinfo: false,
    },
    context: resolve(__dirname, 'src'),
    resolve: {
      alias: {},
      extensions: ['*', '.js', '.jsx', '.json'],
      fallback: {
        // path: false,
        buffer: require.resolve('buffer/'),
        crypto: require.resolve('crypto-browserify'),
        fs: false,
        stream: require.resolve('stream-browserify'),
        util: require.resolve('util/'),
        //process: resolve(__dirname, '../src') + '/hacks/process/browser.js',
      }
    },
    externals: {},
    module: {
      exprContextCritical: false,
      noParse: [
        /\.md$/,
      ],
      rules: [
        {
          test: /workers\/(hello|raven)\.js$/,
          use: [
            {
              loader: 'worker-loader',
              options: {
                //inline: 'no-fallback',
              },
            },
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
              }
            },
          ],
        },
        {
          test: /\.jsx?$/,
          include: [
            resolve(__dirname, 'src'),
            resolve(__dirname, '../src'),
            /node_modules\/(@gdbots|@triniti)/,
          ],
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          }
        },
        {
          test: /\.(eot|gif|jpg|jpeg|png|ttf|woff|woff2)$/,
          type: 'asset/resource',
        },
        {
          test: /\.svg$/,
          type: 'asset/source',
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
            },
          ],
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
              options: {
                importLoaders: 3,
              },
            },
            {
              loader: 'postcss-loader',
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
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: 'chunks/[id].css',
      }),

      new webpack.DefinePlugin(Object.entries(env).reduce((acc, pair) => {
        const [key, value] = pair;
        acc[key] = JSON.stringify(value);
        return acc;
      }, {})),

      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),

      new NodePolyfillPlugin({
        includeAliases: ['path']
      }),
    ]
  };
};
