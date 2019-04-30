// 'Legacy' configuration for older browsers that only support ES5

const config = require('./config.json')
const base = require('./base.config')
const path = require('path')

module.exports = Object.assign({}, base.config, {
  output: {
    filename: 'javascripts/[name].es5.bundle.js',
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