const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');
const path = require('path');

module.exports = merge(common, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(tsx?|js)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: require('./babel.config'),
      }
    ]
  },
});
