const path = require('path');
const nodeExternals = require('webpack-node-externals');
const tsconfig = require('./tsconfig.json');

module.exports = (env, options) => ({
  entry: './src/index.ts',
  target: 'node',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  externals: options.mode === 'development' ? nodeExternals() : undefined,
  resolve: {
    extensions: [
      '.tsx', '.ts', '.js'
    ],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist')
  }
});
