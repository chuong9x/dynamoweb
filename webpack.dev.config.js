var webpack = require('webpack');
var merge = require('webpack-merge');
var path = require('path');

var APP_DIR = path.resolve(__dirname, 'src/client/app');

module.exports = merge(require('./webpack.config.js'), {
  entry: [
    'webpack/hot/dev-server',
    'webpack-hot-middleware/client'
  ],
  output: {
    path: '/',
    publicPath: 'http://localhost:3000/public/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['react-hot', 'babel'],
        include: APP_DIR
      }
    ]
  }
});
