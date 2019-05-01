// Build both 'modern' and 'legacy' javascript bundles using separate configs
// -> this is the base config, shared by both versions
// -> based on Philip Walton's examples at 
// -> https://philipwalton.com/articles/deploying-es2015-code-in-production-today/

const path = require('path')
const config = require('./config.json')
const Fiber = require('fibers')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const { getManifest, addAsset } = require('./utils/assets')


const commonConfig = {
  mode: 'development',
  entry: {
    styles: './webpack_assets/stylesheets/main.scss',
    main: './webpack_assets/javascripts/main.mjs'
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        test: /\.m?js(\?.*)?$/i,
        sourceMap: true,
        terserOptions: {
          safari10: true
        }
      })
    ]
  }
}

console.log(`MODE: ${commonConfig.mode}`)

// set up babel loader rules
// -> pass in desired browser targets for specific build
const configureBabelLoader = (browserlist) => {
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
}

// common loader rules, used in both modern and legacy configs
const commonLoaderRules = () => {
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
          // prefer dart-sass because node-sass seems to have security vulnerabilities right now
          implementation: require('sass'),
          fiber: Fiber,
          includePaths: ['node_modules']
        }
      }
    ]
  }
}

// plugins used in both modern and legacy configs
const commonPlugins = () => {
  return [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'stylesheets/[name]-[chunkhash:10].css',
      chunkFilename: 'stylesheets/[id]-[chunkhash:10].css'
    }),
    new ManifestPlugin({
      seed: getManifest(),
      fileName: path.join('../', config.manifestFileName),
      publicPath: config.assetsDir,
      generate: (seed, files) => {
        return files.reduce((manifest, opts) => {
          // Needed until this issue is resolved:
          // https://github.com/danethurber/webpack-manifest-plugin/issues/159
          const unhashedName = path.basename(opts.path)
            .replace(/[_.-][0-9a-f]{10}/, '')

          addAsset(unhashedName, opts.path)
          return getManifest()
        }, seed)
      },
    })
  ]
}

module.exports = {
  configureBabelLoader,
  commonConfig,
  commonLoaderRules,
  commonLoaderRules,
  commonPlugins
}