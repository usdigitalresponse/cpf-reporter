import initializeDb from './src/lib/db'

beforeAll(async () => {
  // avoid conflict in dev container
  process.env.NODE_ENV = 'test';

  await initializeDb()
})
