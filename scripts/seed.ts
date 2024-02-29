import type { Prisma } from '@prisma/client'
import { db } from 'api/src/lib/db'

export default async () => {
  try {
    //
    // Manually seed via `yarn rw prisma db seed`
    // Seeds automatically with `yarn rw prisma migrate dev` and `yarn rw prisma migrate reset`
    //

    const organization: Prisma.OrganizationCreateArgs['data'] =
      await db.organization.create({
        data: {
          name: 'Example Organization',
        },
      })

    const agency: Prisma.AgencyCreateArgs['data'] = await db.agency.create({
      data: {
        name: 'Example Agency',
        code: 'EA',
        organizationId: organization.id,
      },
    })

    const users: Prisma.UserCreateManyInput[] = [
      {
        email: 'ORGANIZATIONSTAFF@testemail.test',
        name: 'Organization Staff',
        role: 'ORGANIZATION_STAFF',
        agencyId: agency.id,
      },
      {
        email: 'ORGANIZATIONADMIN@testemail.test',
        name: 'Organization Admin',
        role: 'ORGANIZATION_ADMIN',
        agencyId: agency.id,
      },
      {
        email: 'USDRADMIN@testemail.test',
        name: 'USDR Admin',
        role: 'USDR_ADMIN',
        agencyId: agency.id,
      },
    ]

    await db.user.createMany({
      data: users,
    })

    const inputTemplates: Prisma.InputTemplateCreateArgs['data'][] = [
      {
        name: 'Input Template 1',
        version: '1.0.0',
        effectiveDate: new Date(),
      },
    ]

    const outputTemplates: Prisma.OutputTemplateCreateArgs['data'][] = [
      {
        name: 'Output Template 1',
        version: '1.0.0',
        effectiveDate: new Date(),
      },
    ]

    // Note: if using PostgreSQL, using `createMany` to insert multiple records is much faster
    // @see: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#createmany
    await Promise.all(
      //
      // Change to match your data model and seeding needs
      //
      inputTemplates.map(
        async (data: Prisma.InputTemplateCreateArgs['data']) => {
          const record = await db.inputTemplate.create({ data })
          console.log(record)
        }
      )
    )

    await Promise.all(
      outputTemplates.map(
        async (data: Prisma.OutputTemplateCreateArgs['data']) => {
          const record = await db.outputTemplate.create({ data })
          console.log(record)
        }
      )
    )

    const expendtitureCategoriesData = [
      {
        name: '1A - Broadband Infrastructure',
        code: '1A',
      },
      {
        name: '1B - Digital Connectivity Technology',
        code: '1B',
      },
      {
        name: '1C - Multi-Purpose Community Facility',
        code: '1C',
      },
    ]
    await Promise.all(
      expendtitureCategoriesData.map(
        async (data: Prisma.ExpenditureCategoryCreateArgs['data']) => {
          const record = await db.expenditureCategory.create({ data })
          console.log(record)
        }
      )
    )

    // If using dbAuth and seeding users, you'll need to add a `hashedPassword`
    // and associated `salt` to their record. Here's how to create them using
    // the same algorithm that dbAuth uses internally:
    //
    //   import { hashPassword } from '@redwoodjs/auth-dbauth-api'
    //
    //   const users = [
    //     { name: 'john', email: 'john@example.com', password: 'secret1' },
    //     { name: 'jane', email: 'jane@example.com', password: 'secret2' }
    //   ]
    //
    //   for (const user of users) {
    //     const [hashedPassword, salt] = hashPassword(user.password)
    //     await db.user.create({
    //       data: {
    //         name: user.name,
    //         email: user.email,
    //         hashedPassword,
    //         salt
    //       }
    //     })
    //   }
  } catch (error) {
    console.warn('Please define your seed data.')
    console.error(error)
  }
}
