// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  organization: {
    id: 42,
    preferences: { current_reporting_period_id: 1 },
    agencies: [{ id: 1, name: 'Agency 1' }],
  },
})
