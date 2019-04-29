const Fiber = require('fibers')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')

module.exports = {

  // config used in both modern and legacy configs
  config: {
    entry: {
      styles: './webpack_assets/stylesheets/test.scss',
      main: './webpack_assets/javascripts/main.mjs'
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          test: /\.m?js(\?.*)?$/i,
          sourceMap: true,
          terserOptions: {
            safari10: true,
          }
        })
      ]
    }
  },

  // output path for all files
  outputPath: '../source/',

  // set up babel loader rules
  // -> pass in desired browser targets for specific build
  configureBabelLoader: browserlist => {
    return {
      test: /\.m?js$/,
      use: {
        loader: 'babel-loader',
        options: {
          babelrc: false,
          presets: [
            ['@babel/preset-env', {
              debug: true,
              modules: false,
              useBuiltIns: 'entry',
              targets: {
                browsers: browserlist,
              },
            }],
          ]
        }
      }
    }
  },

  // common loader rules, used in both modern and legacy configs
  commonLoaderRules: () => {
    return {
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
  },

  // plugins used in both modern and legacy configs
  commonPlugins: () => {
    return [
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: 'stylesheets/[name].bundle.css',
        chunkFilename: 'stylesheets/[id].css'
      })
    ]
  }
}