export const standard = (/* vars, { ctx, req } */) => ({
  reportingPeriodsWithCertification: [
    {
      id: 1,
      name: 'First Reporting Period',
      startDate: '2024-01-01T00:00:00.000Z',
      endDate: '2024-02-01T00:00:00.000Z',
      certificationForOrganization: {
        id: 1,
        createdAt: '2024-09-25T20:09:33.704Z',
        certifiedBy: {
          id: 1,
          email: 'usdr-admin@usdr.dev',
        },
      },
    },
    {
      id: 2,
      name: 'Second Reporting Period',
      startDate: '2024-02-02T00:00:00.000Z',
      endDate: '2024-03-01T00:00:00.000Z',
      certificationForOrganization: null,
    },
    {
      id: 3,
      name: 'Third Reporting Period',
      startDate: '2024-03-02T00:00:00.000Z',
      endDate: '2024-04-01T00:00:00.000Z',
      certificationForOrganization: null,
    },
  ],
  organizationOfCurrentUser: {
    id: 1,
    preferences: { current_reporting_period_id: 2 },
  },
})
