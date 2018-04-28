const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = (env, options) => ({
  entry: './src/index.ts',
  target: 'node',
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
    ]
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist')
  }
});
