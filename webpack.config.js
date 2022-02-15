const TerserPlugin = require('terser-webpack-plugin');
const WebpackObfuscator = require('webpack-obfuscator');
const path = require('path');

module.exports = {
  mode: "development",
  entry: './src/main.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts'],
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'public'),
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin(),
      // new WebpackObfuscator ({ rotateStringArray: true }),
    ],
  },
};