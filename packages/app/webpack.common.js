const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const convertPathsToAliases = require('convert-tsconfig-paths-to-webpack-aliases').default;
const tsconfig = require('./tsconfig.json');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

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
    ],
    alias: convertPathsToAliases(require('./tsconfig.json'))
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader','css-loader'],
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: './src/index.html'
    }),
    new ForkTsCheckerWebpackPlugin(),
  ],
  node: {
    fs: "empty"
  }
};

module.exports = config;
