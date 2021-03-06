const webpack = require('webpack')
const path = require('path')

const SRC_DIR = path.resolve(__dirname, 'ui')
const OUTPUT_DIR = path.resolve(__dirname, 'qinterest/static')

module.exports = {
  entry: SRC_DIR + '/index.js',
  mode: 'development',
  output: {
    path: OUTPUT_DIR,
    publicPath: '/',
    filename: 'bundle.js',
  },
  optimization: {
    minimize: false,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          }
        ],
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
      },
    ],
  },
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom'
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  devtool: 'inline-source-map',
  devServer: {
    hot: true,
    writeToDisk: true,
    port: 9000
  },
}
