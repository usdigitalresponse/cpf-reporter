import initializeDb from './src/lib/db'

beforeAll(async () => {
  await initializeDb()
})
