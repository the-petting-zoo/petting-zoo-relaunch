// From Philip Walton's webpack example
// -> https://github.com/philipwalton/webpack-esnext-boilerplate/blob/master/tasks/utils/assets.js

const fs = require('fs-extra')
const path = require('path')
const config = require('../config.json')

let revisionedAssetManifest

const manifestPath = path.resolve(
  __dirname, 
  path.join(
    '../', 
    config.outputPath, 
    config.manifestFileName
  )
)

const getManifest = () => {
  if (!revisionedAssetManifest) {
    revisionedAssetManifest = fs.readJsonSync(manifestPath, {throws: false}) || {}
  }

  return revisionedAssetManifest
}

const saveManifest = () => {
  fs.outputJson(manifestPath, revisionedAssetManifest, {spaces: 2})
}

const resetManifest = () => {
  revisionedAssetManifest = {}
  saveManifest()
}

const getAsset = (filename) => {
  getManifest()

  if (!revisionedAssetManifest[filename]) {
    throw new Error(`Revisioned file for '${filename}' doesn't exist`)
  }

  return revisionedAssetManifest[filename]
}

const addAsset = async (filename, revisionedFilename) => {
  getManifest()
  revisionedAssetManifest[filename] = revisionedFilename
  saveManifest()
}

const getRevisionedAssetUrl = (filename) => {
  return path.join(config.publicStaticPath, getAsset(filename))
}

module.exports = {
  getManifest,
  saveManifest,
  resetManifest,
  getAsset,
  addAsset,
  getRevisionedAssetUrl,
}