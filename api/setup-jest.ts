import initializeDb from './src/lib/db'

beforeAll(async () => {
  // explicit set to avoid conflict in docker container
  process.env.NODE_ENV = 'test'
  await initializeDb()
})
