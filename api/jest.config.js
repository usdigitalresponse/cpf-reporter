// More info at https://redwoodjs.com/docs/project-configuration-dev-test-build

const config = {
  rootDir: '../',
  preset: '@redwoodjs/testing/config/jest/api',
  coverageReporters: [
    'json',
    'html',
    ['text', { file: 'coverage.txt', path: './' }],
  ],
  collectCoverageFrom: ['!**/*.sdl.ts'],
  setupFilesAfterEnv: ['<rootDir>/api/setup-jest.ts'],
}

module.exports = config
