export const users = [
  {
    email: 'usdr-admin@usdr.dev',
    name: 'USDR Admin',
    role: 'USDR_ADMIN',
    agency: {
      name: 'Main Agency',
      abbreviation: 'MAUSDR',
      code: 'MAUSDR',
      organizationId: 1,
    },
    agencyId: 1, // TO_DEPRECATE
    organizationId: 1, // TO_DEPRECATE
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    email: 'organization-admin@usdr.dev',
    name: 'Organization Admin',
    role: 'ORGANIZATION_ADMIN',
    agency: {
      name: 'Main Agency',
      abbreviation: 'MAUSDR',
      code: 'MAUSDR',
      organizationId: 1,
    },
    agencyId: 1, // TO_DEPRECATE
    organizationId: 1, // TO_DEPRECATE
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    email: 'organization-staff@usdr.dev',
    name: 'Organization Staff',
    role: 'ORGANIZATION_STAFF',
    agency: {
      name: 'Main Agency',
      abbreviation: 'MAUSDR',
      code: 'MAUSDR',
      organizationId: 1,
    },
    agencyId: 1, // TO_DEPRECATE
    organizationId: 1, // TO_DEPRECATE
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]
