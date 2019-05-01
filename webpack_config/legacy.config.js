// 'Legacy' configuration for older browsers that only support ES5

const config = require('./config.json')
const base = require('./base.config')
const path = require('path')

module.exports = Object.assign({}, base.commonConfig, {
  output: {
    filename: 'javascripts/[name]-[chunkhash:10].es5.js',
    path: path.resolve(__dirname, path.join(config.outputPath, config.assetsDir))
  },
  module: {
    rules: [
      base.configureBabelLoader([
        '> 1%',
        'last 2 versions',
        'Firefox ESR'
      ]),
      base.commonLoaderRules()
    ]
  },
  plugins: base.commonPlugins()
})