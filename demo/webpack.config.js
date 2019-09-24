const dotenv = require('dotenv');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');
const { resolve } = require('path');

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
}, Object.assign({ NODE_ENV: 'development', APP_BASE_URL: '/' }, webpackEnv, dotenv.config().parsed));

/**
 * @link https://webpack.js.org/configuration/
 *
 * @param {Object} webpackEnv
 *
 * @return {Object}
 */
module.exports = (webpackEnv = {}) => {
  const env = compileEnvVars(webpackEnv);
  const definePluginObj = Object.entries(env).reduce((acc, pair) => {
    const [key, value] = pair;

    acc[key] = JSON.stringify(value);
    return acc;
  }, {});

  return {
    entry: (() => ({
      main: './index.jsx',
      common: [
        'classnames',
        'react',
        'react-dom',
        'react-popper',
        'react-redux',
        'react-transition-group',
        'react-universal-component',
        'redux',
        'redux-logger',
        'whatwg-fetch',
      ],
      dev: [
        'webpack-dev-server/client?https://localhost:8080',
        'webpack/hot/only-dev-server',
      ],
    }))(),
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    devServer: {
      port: 8080,
      https: true,
      hot: true,
      contentBase: resolve(__dirname, 'dist'),
      watchOptions: {
        ignored: /\/node_modules\/.*/,
      },
    },
    output: {
      path: resolve(__dirname, 'dist'),
      publicPath: '/',
      filename: '[name].bundle.js',
      chunkFilename: 'chunks/[name].bundle.js',
      library: 'triniti',
      pathinfo: false,
    },
    context: resolve(__dirname, 'src'),
    resolve: {
      extensions: ['*', '.js', '.jsx', '.json'],
      alias: {},
    },
    externals: {},
    module: {
      exprContextCritical: false,
      rules: [
        {
          test: /\.jsx?$/,
          include: [
            resolve(__dirname, 'src'),
            resolve(__dirname, '../src'),
            /node_modules\/@gdbots/,
          ],
          loader: 'babel-loader',
        },
        // {
        //   test: /\.html$/,
        //   loader: 'html-loader',
        // },
        {
          test: /\.(png|gif|jpg)$/,
          loader: 'url-loader',
          options: {
            limit: 50000,
          },
        },
        {
          test: /\.svg$/,
          loader: [
            'raw-loader',
          ],
        },
        {
          test: /\.(woff|woff2|eot|ttf)$/,
          loader: 'file-loader',
          options: {
            name: './assets/[path][name].[ext]',
          },
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

        // sass rule
        (() => ({
          test: /\.scss$/,
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
        }))(),
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: 'z[id].css', // ensures load order
      }),

      new webpack.DefinePlugin(Object.assign(
        definePluginObj,
        { DEMO_SCREENS: JSON.stringify(fs.readdirSync('./src/screens/').filter(file => !file.includes('DS_Store'))) },
      )),

      new HtmlWebpackPlugin({
        template: 'index.html',
        filename: 'index.html',
        chunks: ['main'],
        app: env,
        bundle: {
          js: [],
          css: [],
        },
        inject: true,
      }),

      // enable HMR globally
      new webpack.HotModuleReplacementPlugin(),

      new webpack.IgnorePlugin(/^\.\/locale$/),
    ],
    optimization: {
      namedModules: true, // NamedModulesPlugin()
      splitChunks: { // CommonsChunkPlugin()
        name: 'common',
        minChunks: Infinity,
      },
      noEmitOnErrors: true, // NoEmitOnErrorsPlugin
      concatenateModules: false, // ModuleConcatenationPlugin
    },
  };
};
