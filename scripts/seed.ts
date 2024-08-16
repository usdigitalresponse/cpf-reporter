import type { Prisma } from '@prisma/client'
import { db, getPrismaClient } from 'api/src/lib/db'

export default async () => {
  try {
    await getPrismaClient()
    //
    // Manually seed via `yarn rw prisma db seed`
    // Seeds automatically with `yarn rw prisma migrate dev` and `yarn rw prisma migrate reset`
    //

    const organization: Prisma.OrganizationCreateArgs['data'] = {
      name: 'US Digital Response',
    }
    const organizationRecord = await db.organization.create({
      data: organization,
    })

    const mainAgency: Prisma.AgencyCreateArgs['data'] = {
      name: 'Main Agency',
      abbreviation: 'MAUSDR',
      code: 'MAUSDR',
      organizationId: organizationRecord.id,
    }
    const mainAgencyRecord = await db.agency.create({ data: mainAgency })

    const users: Prisma.UserCreateArgs['data'][] = [
      {
        email: 'usdr-admin@usdr.dev',
        name: 'USDR Admin',
        agencyId: mainAgencyRecord.id,
        role: 'USDR_ADMIN',
      },
      {
        email: 'organization-admin@usdr.dev',
        name: 'Organization Admin',
        agencyId: mainAgencyRecord.id,
        role: 'ORGANIZATION_ADMIN',
      },
      {
        email: 'organization-staff@usdr.dev',
        name: 'Organization Staff',
        agencyId: mainAgencyRecord.id,
        role: 'ORGANIZATION_STAFF',
      },
    ]
    // Note: if using PostgreSQL, using `createMany` to insert multiple records is much faster
    // @see: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#createmany
    await Promise.all(
      users.map(async (data: Prisma.UserCreateArgs['data']) => {
        const record = await db.user.create({ data })
        console.log(record)
      })
    )

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

    let lastInputTemplateId: number
    await Promise.all(
      //
      // Change to match your data model and seeding needs
      //
      inputTemplates.map(
        async (data: Prisma.InputTemplateCreateArgs['data']) => {
          const record = await db.inputTemplate.create({ data })
          console.log(record)
          lastInputTemplateId = record.id
        }
      )
    )

    let lastOutputTemplateId: number
    await Promise.all(
      outputTemplates.map(
        async (data: Prisma.OutputTemplateCreateArgs['data']) => {
          const record = await db.outputTemplate.create({ data })
          console.log(record)
          lastOutputTemplateId = record.id
        }
      )
    )

    const reportingPeriodData: Prisma.ReportingPeriodCreateArgs['data'] = {
      name: 'First Reporting Period',
      startDate: new Date(),
      endDate: new Date(),
      inputTemplateId: lastInputTemplateId,
      outputTemplateId: lastOutputTemplateId,
    }
    const reportingPeriod = await db.reportingPeriod.create({
      data: reportingPeriodData,
    })
    console.log(reportingPeriod)

    await db.organization.update({
      where: { id: organizationRecord.id },
      data: {
        preferences: {
          current_reporting_period_id: reportingPeriod.id,
        },
      },
    })

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
