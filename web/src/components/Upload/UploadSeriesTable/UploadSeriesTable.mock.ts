import type { FindUploadById } from 'types/graphql'

export const standardUpload = (): FindUploadById['upload'] => ({
  id: 2,
  filename: 'CPF Input Template v20240524.xlsm',
  createdAt: '2024-09-05T22:02:35.736Z',
  updatedAt: '2024-09-05T22:02:35.736Z',
  __typename: 'Upload',
  agency: {
    code: 'MAUSDR',
    __typename: 'Agency',
  },
  expenditureCategory: null,
  reportingPeriod: {
    name: 'First Reporting Period',
    __typename: 'ReportingPeriod',
  },
  uploadedBy: {
    id: 1,
    name: 'USDR Admin',
    __typename: 'User',
  },
  latestValidation: {
    id: 28,
    passed: true,
    isManual: false,
    results: {
      errors: [],
    },
    createdAt: '2024-10-22T00:03:57.027Z',
    __typename: 'UploadValidation',
    initiatedBy: {
      name: 'USDR Admin',
      __typename: 'User',
    },
  },
})

export const standardSeriesUploads =
  (): FindUploadById['upload']['seriesUploads'] => [
    {
      id: 10,
      createdAt: '2024-10-21T23:56:49.260Z',
      __typename: 'Upload',
      latestValidation: {
        id: 26,
        passed: false,
        isManual: false,
        results: null,
        createdAt: '2024-10-21T23:56:49.310Z',
        __typename: 'UploadValidation',
      },
    },
    {
      id: 2,
      createdAt: '2024-09-05T22:02:35.736Z',
      __typename: 'Upload',
      latestValidation: {
        id: 28,
        passed: true,
        isManual: false,
        results: {
          errors: [],
        },
        createdAt: '2024-10-22T00:03:57.027Z',
        __typename: 'UploadValidation',
      },
    },
  ]
