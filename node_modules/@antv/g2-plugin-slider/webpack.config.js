const webpack = require('webpack');
const {
  resolve
} = require('path');

module.exports = {
  entry: {
    'g2-plugin-slider': './index.js'
  },
  output: {
    filename: '[name].js',
    library: 'Slider',
    libraryTarget: 'umd',
    path: resolve(__dirname, 'build/')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: true
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.AggressiveMergingPlugin()
  ]
};
