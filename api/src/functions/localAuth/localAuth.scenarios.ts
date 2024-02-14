import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario({
  // Define the "fixture" to write into your test database here
  // See guide: https://redwoodjs.com/docs/testing#scenarios
  user: {
    one: {
      data: {
        email: 'grants-admin@usdr.dev',
        name: 'Grants Admin',
        role: 'USDR_ADMIN',
        agency: {
          create: {
            name: 'Main Agency',
            abbreviation: 'MAUSDR',
            code: 'MAUSDR',
          },
        },
        organization: {
          create: {
            name: 'USDR',
          },
        },
      },
      include: {
        agency: true,
        organization: true,
      },
    },
  },
})

export type StandardScenario = ScenarioData<unknown>
