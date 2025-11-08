const { getDefaultConfig } = require('expo/metro-config')

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname)

// Add Tamagui support
config.transformer.minifierConfig = {
  keep_fnames: true,
}

// Ensure SVG support
config.resolver.assetExts.push('svg')

module.exports = config
