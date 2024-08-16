// import type { Prisma, Subrecipient } from '@prisma/client'
import type {
  Prisma,
  Upload,
  User,
  Organization,
  Agency,
  Subrecipient,
} from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<
  | Prisma.OrganizationCreateArgs
  | Prisma.AgencyCreateArgs
  | Prisma.UserCreateArgs
  | Prisma.SubrecipientCreateArgs
>({
  organization: {
    one: {
      data: {
        name: 'USDR',
        preferences: {},
      },
    },
  },
  agency: {
    one: (scenario) => ({
      data: {
        name: 'Agency1',
        organizationId: scenario.organization.one.id,
        code: 'A1',
      },
      include: {
        organization: true,
      },
    }),
  },
  user: {
    one: (scenario) => ({
      data: {
        email: 'uniqueemail1@test.com',
        name: 'String',
        role: 'USDR_ADMIN',
        agencyId: scenario.agency.one.id,
      },
      include: {
        agency: true,
      },
    }),
  },
  subrecipient: {
    one: (scenario) => ({
      data: {
        name: 'String',
        organization: { connect: { id: scenario.organization.one.id } },
        ueiTinCombo: '10934_985867',
      },
    }),
    two: (scenario) => ({
      data: {
        name: 'String',
        organization: { connect: { id: scenario.organization.one.id } },
        ueiTinCombo: '12485_920485',
      },
    }),
  },
})

export type StandardScenario = ScenarioData<User, 'user'> &
  ScenarioData<Organization, 'organization'> &
  ScenarioData<Agency, 'agency'> &
  ScenarioData<Subrecipient, 'subrecipient'>
