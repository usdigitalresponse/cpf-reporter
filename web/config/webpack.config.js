/** @returns {import('webpack').Configuration} Webpack Configuration */

module.exports = (config, { mode }) => {
  if (mode != 'development') {
    // Exclude deploy-config.js from the bundle if we are not developing locally
    config.externals = /^(.*\/public\/deploy-config\.js|\$)$/i
  }
  return config
}
