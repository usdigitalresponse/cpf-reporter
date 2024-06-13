import type { Prisma, SubrecipientUpload } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.SubrecipientUploadCreateArgs>({
  subrecipientUpload: {
    one: {
      data: {
        ueiTinCombo: 'String',
        rawSubrecipient: { foo: 'bar' },
        version: 'V2023_12_12',
        subrecipient: {
          create: {
            name: 'String',
            organization: { create: { name: 'String' } },
          },
        },
      },
    },
    two: {
      data: {
        ueiTinCombo: 'String',
        rawSubrecipient: { foo: 'bar' },
        version: 'V2023_12_12',
        subrecipient: {
          create: {
            name: 'String',
            organization: { create: { name: 'String' } },
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<
  SubrecipientUpload,
  'subrecipientUpload'
>
