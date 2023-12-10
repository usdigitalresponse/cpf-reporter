import type { Prisma, Project } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ProjectCreateArgs>({
  project: {
    one: {
      data: {
        code: 'String',
        name: 'String',
        status: 'String',
        description: 'String',
        updatedAt: '2023-12-09T14:50:29.322Z',
        agency: { create: { name: 'String', code: 'String' } },
        organization: { create: { name: 'String' } },
        originationPeriod: {
          create: {
            name: 'String',
            startDate: '2023-12-09T14:50:29.322Z',
            endDate: '2023-12-09T14:50:29.322Z',
            updatedAt: '2023-12-09T14:50:29.322Z',
            inputTemplate: {
              create: {
                name: 'String',
                version: 'String',
                effectiveDate: '2023-12-09T14:50:29.322Z',
                updatedAt: '2023-12-09T14:50:29.322Z',
              },
            },
            outputTemplate: {
              create: {
                name: 'String',
                version: 'String',
                effectiveDate: '2023-12-09T14:50:29.322Z',
                updatedAt: '2023-12-09T14:50:29.322Z',
              },
            },
          },
        },
      },
    },
    two: {
      data: {
        code: 'String',
        name: 'String',
        status: 'String',
        description: 'String',
        updatedAt: '2023-12-09T14:50:29.322Z',
        agency: { create: { name: 'String', code: 'String' } },
        organization: { create: { name: 'String' } },
        originationPeriod: {
          create: {
            name: 'String',
            startDate: '2023-12-09T14:50:29.322Z',
            endDate: '2023-12-09T14:50:29.322Z',
            updatedAt: '2023-12-09T14:50:29.322Z',
            inputTemplate: {
              create: {
                name: 'String',
                version: 'String',
                effectiveDate: '2023-12-09T14:50:29.322Z',
                updatedAt: '2023-12-09T14:50:29.322Z',
              },
            },
            outputTemplate: {
              create: {
                name: 'String',
                version: 'String',
                effectiveDate: '2023-12-09T14:50:29.322Z',
                updatedAt: '2023-12-09T14:50:29.322Z',
              },
            },
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Project, 'project'>
