module.exports = {
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
  output: {
    filename: "[name].js",
    path: __dirname + "/dist",
  },
}
