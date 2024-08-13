import type { Prisma, Subrecipient } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.SubrecipientCreateArgs>({
  subrecipient: {
    one: {
      data: {
        name: 'String',
        updatedAt: '2023-12-09T14:50:18.317Z',
        organization: { create: { name: 'String' } },
        ueiTinCombo: '12345802934',
        subrecipientUploads: {
          create: [
            {
              rawSubrecipient: { data: 'old data' },
              version: 'V2023_12_12',
              createdAt: '2023-12-09T14:50:18.317Z',
              upload: {
                create: {
                  filename: 'old_upload.xlsx',
                  uploadedBy: {
                    create: {
                      name: 'Uploader',
                      email: 'uploader@example.com',
                      role: 'ORGANIZATION_STAFF',
                      agency: { create: { name: 'Agency One', code: 'A1' } },
                    },
                  },
                  reportingPeriod: {
                    create: {
                      name: 'Q4 2023',
                      startDate: '2023-10-01T00:00:00.000Z',
                      endDate: '2023-12-31T23:59:59.999Z',
                      inputTemplate: {
                        create: {
                          name: 'Input Template 2023',
                          version: '1.0',
                          effectiveDate: '2023-01-01T00:00:00.000Z',
                        },
                      },
                      outputTemplate: {
                        create: {
                          name: 'Output Template 2023',
                          version: '1.0',
                          effectiveDate: '2023-01-01T00:00:00.000Z',
                        },
                      },
                    },
                  },
                },
              },
            },
            {
              rawSubrecipient: { data: 'new data' },
              version: 'V2024_01_07',
              createdAt: '2024-01-07T10:00:00.000Z',
              upload: {
                create: {
                  filename: 'new_upload.xlsx',
                  uploadedBy: {
                    create: {
                      name: 'New Uploader',
                      email: 'new_uploader@example.com',
                      role: 'ORGANIZATION_STAFF',
                      agency: { create: { name: 'Agency Two', code: 'A2' } },
                    },
                  },
                  reportingPeriod: {
                    create: {
                      name: 'Q1 2024',
                      startDate: '2024-01-01T00:00:00.000Z',
                      endDate: '2024-03-31T23:59:59.999Z',
                      inputTemplate: {
                        create: {
                          name: 'Input Template 2024',
                          version: '1.0',
                          effectiveDate: '2024-01-01T00:00:00.000Z',
                        },
                      },
                      outputTemplate: {
                        create: {
                          name: 'Output Template 2024',
                          version: '1.0',
                          effectiveDate: '2024-01-01T00:00:00.000Z',
                        },
                      },
                    },
                  },
                },
              },
            },
          ],
        },
      },
    },
    two: {
      data: {
        name: 'String',
        updatedAt: '2023-12-09T14:50:18.317Z',
        organization: { create: { name: 'String' } },
        ueiTinCombo: '12485920485',
      },
    },
  },
})

export type StandardScenario = ScenarioData<Subrecipient, 'subrecipient'>
