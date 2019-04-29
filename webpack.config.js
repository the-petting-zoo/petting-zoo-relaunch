const path = require('path');
const Fiber = require('fibers');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './webpack/stylesheets/test.scss',
  output: {
    filename: 'javascripts/[name].bundle.js',
    path: path.resolve(__dirname, 'source/assets/')
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              fiber: Fiber,
              includePaths: ['node_modules']
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'stylesheets/[name].css',
      chunkFilename: '[id].css'
    })
  ]
}