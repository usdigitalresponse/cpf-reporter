/** @returns {import('webpack').Configuration} Webpack Configuration */

module.exports = (config, { mode }) => {
  if (mode === 'development') {
    // Add dev plugin
    if (mode === 'development') {
      // Exclude deploy-config.js from the bundle
      config.externals = {
        '**/deploy-config.js': 'deployConfig',
      }
    }
  }
  return config
}
