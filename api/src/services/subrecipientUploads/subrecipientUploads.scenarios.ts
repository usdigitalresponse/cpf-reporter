import type {
  Prisma,
  SubrecipientUpload,
  Organization,
  Agency,
  Subrecipient,
} from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<
  | Prisma.OrganizationCreateArgs
  | Prisma.AgencyCreateArgs
  | Prisma.SubrecipientUploadCreateArgs
  | Prisma.SubrecipientCreateArgs
>({
  organization: {
    one: {
      data: {
        name: 'String',
      },
    },
  },
  agency: {
    one: (scenario) => ({
      data: {
        name: 'String',
        organization: {
          connect: {
            id: scenario.organization.one.id,
          },
        },
        code: 'String',
      },
      include: {
        organization: true,
      },
    }),
  },
  subrecipient: {
    one: (scenario) => ({
      data: {
        name: 'String',
        organization: { connect: { id: scenario.organization.one.id } },
        ueiTinCombo: 'String4',
      },
    }),
  },
  subrecipientUpload: {
    one: (scenario) => ({
      data: {
        rawSubrecipient: {
          Name: 'Test Organization',
          Recipient_Profile_ID__c: '12345',
          POC_Name__c: 'John Doe',
          POC_Phone_Number__c: '123-456-7890',
          POC_Email_Address__c: 'john.doe@example.com',
          Zip__c: '12345',
          Zip_4__c: '6789',
          Address__c: '123 Main St',
          Address_2__c: 'Suite 456',
          Address_3__c: 'null',
          City__c: 'Testville',
          State_Abbreviated__c: 'TS',
        },
        version: 'V2023_12_12',
        subrecipient: {
          create: {
            name: 'String',
            organization: { connect: { id: scenario.organization.one.id } },
            ueiTinCombo: 'String1',
          },
        },
        upload: {
          create: {
            filename: 'testfile.xlsm',
            uploadedBy: {
              create: {
                name: 'String',
                email: 'test098304983@test.com',
                role: 'USDR_ADMIN',
                updatedAt: '2023-12-08T21:03:20.706Z',
                agency: { connect: { id: scenario.agency.one.id } },
              },
            },
            agency: {
              connect: {
                id: scenario.agency.one.id,
              },
            },
            reportingPeriod: {
              create: {
                name: 'rep-period-1',
                startDate: '2023-12-08T21:03:20.706Z',
                endDate: '2023-12-08T21:03:20.706Z',
                updatedAt: '2023-12-08T21:03:20.706Z',
                inputTemplate: {
                  create: {
                    name: 'input-template-1',
                    version: '1',
                    effectiveDate: '2023-12-08T21:03:20.706Z',
                    updatedAt: '2023-12-08T21:03:20.706Z',
                  },
                },
                outputTemplate: {
                  create: {
                    name: 'output-template-1',
                    version: '1',
                    effectiveDate: '2023-12-08T21:03:20.706Z',
                    updatedAt: '2023-12-08T21:03:20.706Z',
                  },
                },
              },
            },
          },
        },
      },
    }),
    two: (scenario) => ({
      data: {
        rawSubrecipient: {
          Name: 'Test Organization2',
          Recipient_Profile_ID__c: '67890',
          POC_Name__c: 'Jane Doe',
          POC_Phone_Number__c: '098-765-4321',
          POC_Email_Address__c: 'jane.doe@example.com',
          Zip__c: '09876',
          Zip_4__c: '6789',
          Address__c: '456 Main St',
          Address_2__c: 'Suite 789',
          Address_3__c: 'null',
          City__c: 'Testtown',
          State_Abbreviated__c: 'TT',
        },
        version: 'V2023_12_12',
        subrecipient: {
          create: {
            name: 'String',
            organization: { connect: { id: scenario.organization.one.id } },
            ueiTinCombo: 'String',
          },
        },
        upload: {
          create: {
            filename: 'testfile.xlsm',
            uploadedBy: {
              create: {
                name: 'String',
                email: 'tests0398409384@test.com',
                role: 'USDR_ADMIN',
                updatedAt: '2023-12-08T21:03:20.706Z',
                agency: { connect: { id: scenario.agency.one.id } },
              },
            },
            agency: {
              connect: {
                id: scenario.agency.one.id,
              },
            },
            reportingPeriod: {
              create: {
                name: 'rep-period-1',
                startDate: '2023-12-08T21:03:20.706Z',
                endDate: '2023-12-08T21:03:20.706Z',
                updatedAt: '2023-12-08T21:03:20.706Z',
                inputTemplate: {
                  create: {
                    name: 'input-template-1',
                    version: '1',
                    effectiveDate: '2023-12-08T21:03:20.706Z',
                    updatedAt: '2023-12-08T21:03:20.706Z',
                  },
                },
                outputTemplate: {
                  create: {
                    name: 'output-template-1',
                    version: '1',
                    effectiveDate: '2023-12-08T21:03:20.706Z',
                    updatedAt: '2023-12-08T21:03:20.706Z',
                  },
                },
              },
            },
          },
        },
      },
    }),
  },
})

export type StandardScenario = ScenarioData<
  SubrecipientUpload,
  'subrecipientUpload'
> &
  ScenarioData<Organization, 'organization'> &
  ScenarioData<Agency, 'agency'> &
  ScenarioData<Subrecipient, 'subrecipient'>
