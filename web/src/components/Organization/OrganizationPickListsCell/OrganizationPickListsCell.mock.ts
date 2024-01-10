// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  organization: {
    id: 42,
    reportingPeriods: [{ id: 1, name: 'Reporting Period 1' }],
    agencies: [{ id: 1, name: 'Agency 1' }],
  },
})
