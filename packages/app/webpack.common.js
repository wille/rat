const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const tsconfig = require('./tsconfig.json');

const config = {
  entry: [
    'react-hot-loader/patch',
    __dirname + '/src/index.tsx',
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash:8].js',
    publicPath: '/'
  },
  resolve: {
    extensions: [
      '.ts',
      '.tsx',
      '.js',
      '.json'
    ]
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: './src/index.html'
    }),
  ]
};

module.exports = config;
