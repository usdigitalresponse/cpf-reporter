import type { Prisma } from '@prisma/client'
import { db } from 'api/src/lib/db'

export default async () => {
  try {
    //
    // Manually seed via `yarn rw prisma db seed`
    // Seeds automatically with `yarn rw prisma migrate dev` and `yarn rw prisma migrate reset`
    //
    console.log('Seeding roles...')
    const rolesData: Prisma.RoleCreateArgs['data'][] = [{ name: 'admin' }]
    await db.role.createMany({ data: rolesData, skipDuplicates: true })

    console.log('Seeding expenditure categories...')
    const expenditureCategoriesData: Prisma.ExpenditureCategoryCreateArgs['data'][] =
      [
        { name: 'Miscellaneous', code: 'MISC' },
        { name: 'Infrastructure', code: 'INFRA' },
      ]
    await db.expenditureCategory.createMany({
      data: expenditureCategoriesData,
      skipDuplicates: true,
    })

    console.log('Seeding organizations...')
    const orgsData: Prisma.OrganizationCreateArgs['data'][] = [
      { name: 'Organization 1' },
      { name: 'Organization 2' },
    ]
    await db.organization.createMany({
      data: orgsData,
      skipDuplicates: true,
    })
    const org1 = await db.organization.findFirstOrThrow({
      where: { name: 'Organization 1' },
    })

    console.log('Seeding agencies...')
    const agenciesData: Prisma.AgencyCreateArgs['data'][] = [
      {
        name: 'Agency 1',
        abbreviation: 'AGN',
        code: 'A1',
        organizationId: org1?.id,
      },
    ]
    await db.agency.createMany({
      data: agenciesData,
      skipDuplicates: true,
    })

    console.log('Seeding input templates...')
    const inputTemplatesData: Prisma.InputTemplateCreateArgs['data'][] = [
      {
        name: 'Input Template 1',
        version: '1001',
        effectiveDate: new Date('2023-10-01'),
      },
    ]
    await db.inputTemplate.createMany({
      data: inputTemplatesData,
      skipDuplicates: true,
    })
    const inputTemplate1 = await db.inputTemplate.findFirstOrThrow({
      where: { name: 'Input Template 1' },
    })

    console.log('Seeding output templates...')
    const outputTemplatesData: Prisma.OutputTemplateCreateArgs['data'][] = [
      {
        name: 'Output Template 1',
        version: '1001',
        effectiveDate: new Date('2023-10-01'),
      },
    ]
    await db.outputTemplate.createMany({
      data: outputTemplatesData,
      skipDuplicates: true,
    })
    const outputTemplate1 = await db.outputTemplate.findFirstOrThrow({
      where: { name: 'Output Template 1' },
    })

    console.log('Seeding reporting periods...')
    const reportingPeriodsData = [
      {
        name: 'Reporting Period 1',
        organizationId: org1?.id,
        startDate: new Date('2023-10-01'),
        endDate: new Date('2023-12-31'),
        inputTemplateId: inputTemplate1?.id,
        outputTemplateId: outputTemplate1?.id,
      },
    ]
    await db.reportingPeriod.createMany({
      data: reportingPeriodsData,
      skipDuplicates: true,
    })

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
    console.warn('There was an error.')
    console.error(error)
  }
}
