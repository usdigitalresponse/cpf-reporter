// More info at https://redwoodjs.com/docs/project-configuration-dev-test-build

const config = {
  rootDir: '../',
  preset: '@redwoodjs/testing/config/jest/web',
  coverageReporters: [
    'json',
    'html',
    ['text', { file: 'coverage.txt', path: './' }],
  ],
  moduleNameMapper: {
    '@passageidentity/passage-elements/passage-user':
      '<rootDir>/__mocks__/passage-user.ts',
  },
}

module.exports = config
