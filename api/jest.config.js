// More info at https://redwoodjs.com/docs/project-configuration-dev-test-build

const config = {
  rootDir: '../',
  preset: '@redwoodjs/testing/config/jest/api',
  coverageReporters: [
    'json',
    'html',
    ['text', { file: 'coverage.txt', path: './' }],
  ],
}

module.exports = config
