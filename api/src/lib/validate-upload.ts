import { Subrecipient, Upload } from '@prisma/client'

import projectUseCodes from 'src/lib/projectUseCodes'
import { recordsForUpload, TYPE_TO_SHEET_NAME } from 'src/lib/records'
import {
  Rule,
  WorkbookContentItem,
  WorkbookRecord,
} from 'src/lib/uploadValidationTypes'
import { ValidationError } from 'src/lib/validation-error'
import { getRules } from 'src/lib/validation-rules'
import {
  subrecipient,
  createSubrecipient,
  updateSubrecipient,
} from 'src/services/subrecipients'
import {
  updateUpload,
  markValidated,
  markInvalidated,
} from 'src/services/uploads'

// Currency strings are must be at least one digit long (\d+)
// They can optionally have a decimal point followed by 1 or 2 more digits (?: \.\d{ 1, 2 })
const CURRENCY_REGEX_PATTERN = /^\d+(?: \.\d{ 1, 2 })?$/g

// Copied from www.emailregex.com
const EMAIL_REGEX_PATTERN =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const SHOULD_NOT_CONTAIN_PERIOD_REGEX_PATTERN = /^[^.]*$/

// This maps from field name to regular expression that must match on the field.
// Note that this only covers cases where the name of the field is what we want to match on.
const FIELD_NAME_TO_PATTERN = {
  POC_Email_Address__c: {
    pattern: EMAIL_REGEX_PATTERN,
    explanation: 'Email must be of the form "user@email.com"',
  },
  Place_of_Performance_City__c: {
    pattern: SHOULD_NOT_CONTAIN_PERIOD_REGEX_PATTERN,
    explanation: 'Field must not contain a period.',
  },
}

function validateFieldPattern(fieldName: string, value: string) {
  let error = null
  const matchedFieldPatternInfo = FIELD_NAME_TO_PATTERN[fieldName]
  if (matchedFieldPatternInfo) {
    const { pattern } = matchedFieldPatternInfo
    const { explanation } = matchedFieldPatternInfo
    if (value && typeof value === 'string' && !value.match(pattern)) {
      error = new Error(`Value entered in cell is "${value}". ${explanation}`)
    }
  }
  return error
}

async function validateVersion({
  records,
  rules,
}: {
  records: WorkbookRecord[]
  rules: { logic: { version: Rule } }
}) {
  const logicRecord = records.find((record) => record?.type === 'logic')
  if (!logicRecord) {
    return new ValidationError(`Upload is missing Logic record`, {
      tab: 'logic',
      row: 1,
      col: 1,
      severity: 'warn',
    })
  }
  if (!logicRecord.content) {
    return new ValidationError(`Logic record is missing "content"`, {
      tab: 'logic',
      row: 1,
      col: 1,
      severity: 'warn',
    })
  }
  const { version } = logicRecord.content
  if (!version) return
  const versionRule = rules.logic.version

  let error = null
  if (version < versionRule.version) {
    error = 'older'
  } else if (version > versionRule.version) {
    error = 'newer'
  }

  if (error) {
    return new ValidationError(
      `Upload template version (${version}) is ${error} than the latest input template (${versionRule.version})`,
      {
        tab: 'logic',
        row: 1,
        col: versionRule.columnName,
        severity: 'warn',
      }
    )
  }

  return undefined
}

async function findRecipientInDatabase({
  recipient,
}: {
  recipient: WorkbookContentItem
}): Promise<Subrecipient> {
  // There are two types of identifiers, UEI and TIN.
  // A given recipient may have either or both of these identifiers.
  return recipient.Unique_Entity_Identifier__c
    ? await subrecipient({ id: Number(recipient.Unique_Entity_Identifier__c) })
    : null
}

function validateIdentifier(
  recipient: WorkbookContentItem,
  recipientExists: boolean
) {
  const errors = []

  // As of Q1, 2023 we require a UEI for all entities of type subrecipient and/or contractor.
  // For beneficiaries or older records, we require a UEI OR a TIN/EIN
  // See https://github.com/usdigitalresponse/usdr-gost/issues/1027
  const hasUEI = Boolean(recipient.Unique_Entity_Identifier__c)
  const hasTIN = Boolean(recipient.EIN__c)
  const entityType = recipient.Entity_Type_2__c
  const isContractorOrSubrecipient =
    String(entityType).includes('Contractor') ||
    String(entityType).includes('Subrecipient')

  if (isContractorOrSubrecipient && !recipientExists && !hasUEI) {
    errors.push(
      new ValidationError(
        'UEI is required for all new subrecipients and contractors',
        { col: 'C', severity: 'err' }
      )
    )
  } else if (!isContractorOrSubrecipient && !hasUEI && !hasTIN) {
    // If this entity is not new, or is not a subrecipient or contractor, then it must have a TIN OR a UEI (same as the old logic)
    errors.push(
      new ValidationError(
        'At least one of UEI or TIN/EIN must be set, but both are missing',
        { col: 'C, D', severity: 'err' }
      )
    )
  }

  return errors
}

function recipientBelongsToUpload(
  existingRecipient: Subrecipient,
  upload: Upload
): boolean {
  return (
    Boolean(existingRecipient) &&
    existingRecipient.originationUploadId === upload?.id &&
    !existingRecipient.updatedAt
  )
}

async function updateOrCreateRecipient(
  existingRecipient: Subrecipient,
  newRecipient: WorkbookContentItem,
  upload: Upload
) {
  // TODO: what if the same upload specifies the same recipient multiple times,
  // but different?

  // If the current upload owns the recipient, we can actually update it
  if (existingRecipient) {
    if (recipientBelongsToUpload(existingRecipient, upload)) {
      await updateSubrecipient({
        id: existingRecipient.id,
        input: newRecipient,
      })
    }
  } else {
    await createSubrecipient({
      input: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        id: newRecipient.Unique_Entity_Identifier__c, // fixme not sure how to force the id if it is set to auto-index
        tin: newRecipient.EIN__c,
        record: newRecipient,
        originationUploadId: upload?.id,
      },
    })
  }
}

async function validateSubrecipientRecord({
  upload,
  record: recipient,
  recordErrors,
}: {
  upload: Upload
  record: WorkbookContentItem
  recordErrors: ValidationError[]
}): Promise<Array<ValidationError>> {
  const errors: ValidationError[] = []
  const existingRecipient = await findRecipientInDatabase({ recipient })
  errors.push(...validateIdentifier(recipient, !!existingRecipient))

  // Either: the record has already been validated before this method was invoked, or
  // we found an error above. If it's not valid, don't update or create it
  if (recordErrors.length === 0 && errors.length === 0) {
    await updateOrCreateRecipient(existingRecipient, recipient, upload)
  }
  return errors
}
function validateProjectUseCode({ records }) {
  const coverRecord = records.find(
    (record: { type: string }) => record?.type === 'cover'
  )
  if (!coverRecord) {
    return new ValidationError(`Upload is missing Cover record`, {
      tab: 'cover',
      row: 1,
      col: 'A',
      severity: 'warn',
    })
  }
  const coverSheet = coverRecord?.content
  if (!coverSheet) {
    return new ValidationError(`Cover record is missing "content"`, {
      tab: 'cover',
      row: 2,
      col: 'A',
      severity: 'warn',
    })
  }

  const codeString = coverSheet['Project Use Code']

  if (!codeString) {
    return new ValidationError('Project Use Code must be set', {
      tab: 'cover',
      row: 2,
      col: 'A',
    })
  }

  const codeParts = codeString.split('-')
  const code = codeParts[0]

  if (!projectUseCodes[code]) {
    return new ValidationError(
      `Record Project Use Code (${code}) from entry (${codeString}) does not match any known Project Use Code`,
      {
        tab: 'cover',
        row: 2,
        col: 'A',
        severity: 'err',
      }
    )
  }

  // TODO EC Code validation in ARPA caused a database update,
  //  even if we want to do that for CPF it probably shouldn't happen as part of validation

  return undefined
}
async function validateRecord({
  upload,
  record,
  typeRules: rules,
}: {
  upload: Upload
  record: WorkbookContentItem
  typeRules: Record<string, Rule>
}) {
  // placeholder for rule errors we're going to find
  const errors = []

  // check all the rules
  for (const [key, rule] of Object.entries(rules)) {
    const recordItem = record[key]

    // if the rule only applies on different EC codes, skip it
    if (
      rule.ecCodes &&
      (!upload.expenditureCategoryId ||
        !(<string[]>rule.ecCodes).includes(upload.expenditureCategoryId))
    ) {
      // eslint-disable-next-line no-continue
      continue
    }

    // if the field is unset/missing/blank, is that okay?
    // we don't treat numeric `0` as unset
    if (
      [undefined, null].includes(recordItem) ||
      (typeof recordItem === 'string' && recordItem === '')
    ) {
      // make sure required keys are present
      if (rule.required === true) {
        errors.push(
          new ValidationError(`Value is required for ${key}`, {
            col: rule.columnName,
            severity: 'err',
          })
        )
      } else if (rule.required === 'Conditional') {
        if (rule.isRequiredFn && rule.isRequiredFn(record)) {
          errors.push(
            new ValidationError(
              // This message should make it clear that this field is conditionally required
              `Based on other values in this row, a value is required for ${key}`,
              { col: rule.columnName, severity: 'err' }
            )
          )
        }
      }

      // if there's something in the field, make sure it meets requirements
    } else {
      // how do we format the value before checking it?
      let value = recordItem
      let formatFailures = 0
      for (const formatter of rule.validationFormatters) {
        try {
          value = formatter(value)
        } catch (e) {
          formatFailures += 1
        }
      }
      if (formatFailures) {
        errors.push(
          new ValidationError(
            `Failed to apply ${formatFailures} formatters while validating value`,
            { col: rule.columnName, severity: 'warn' }
          )
        )
      }

      // make sure pick value is one of pick list values
      if (rule.listVals.length > 0) {
        // enforce validation in lower case
        const lcItems = rule.listVals.map((val) => val.toLowerCase())

        // for pick lists, the value must be one of possible values
        if (rule.dataType === 'Pick List' && !lcItems.includes(String(value))) {
          errors.push(
            new ValidationError(
              `Value for ${key} ('${value}') must be one of ${lcItems.length} options in the input template`,
              { col: rule.columnName, severity: 'err' }
            )
          )
        }

        // for multi select, all the values must be in the list of possible values
        if (rule.dataType === 'Multi-Select') {
          const entries = String(value)
            .split(';')
            .map((val) => val.trim())
          for (const entry of entries) {
            if (!lcItems.includes(entry)) {
              errors.push(
                new ValidationError(
                  `Entry '${entry}' of ${key} is not one of ${lcItems.length} valid options`,
                  { col: rule.columnName, severity: 'err' }
                )
              )
            }
          }
        }
      }

      if (
        ['Currency', 'Currency1', 'Currency2', 'Currency3'].includes(
          rule.dataType
        )
      ) {
        if (
          value &&
          typeof value === 'string' &&
          !value.match(CURRENCY_REGEX_PATTERN)
        ) {
          errors.push(
            new ValidationError(
              `Data entered in cell is "${value}", but it must be a number with at most 2 decimals`,
              { severity: 'err', col: rule.columnName }
            )
          )
        }
      }

      if (rule.dataType === 'Date') {
        if (
          value &&
          typeof value === 'string' &&
          Number.isNaN(Date.parse(value))
        ) {
          errors.push(
            new ValidationError(
              `Data entered in cell is "${value}", which is not a valid date.`,
              { severity: 'err', col: rule.columnName }
            )
          )
        }
      }

      if (rule.dataType === 'String') {
        const patternError = validateFieldPattern(key, String(value))
        if (patternError) {
          errors.push(
            new ValidationError(patternError.message, {
              severity: 'err',
              col: rule.columnName,
            })
          )
        }
      }

      if (rule.dataType === 'Numeric') {
        if (typeof value === 'string' && Number.isNaN(parseFloat(value))) {
          // If this value is a string that can't be interpretted as a number, then error.
          // Note: This value might not be exactly what was entered in the workbook. The val
          // has already been fed through formatters that may have changed the value.
          errors.push(
            new ValidationError(
              `Expected a number, but the value was '${value}'`,
              { severity: 'err', col: rule.columnName }
            )
          )
        }
      }

      // make sure max length is not too long
      if (rule.maxLength) {
        if (
          (rule.dataType === 'String' || rule.dataType === 'String-Fixed') &&
          String(recordItem).length > rule.maxLength
        ) {
          errors.push(
            new ValidationError(
              `Value for ${key} cannot be longer than ${
                rule.maxLength
              } (currently, ${String(recordItem).length})`,
              { col: rule.columnName, severity: 'err' }
            )
          )
        }
      }
    }
  }
  return errors
}

async function validateRules({
  upload,
  records,
  rules,
}: {
  upload: Upload
  records: WorkbookRecord[]
  rules: Record<string, Record<string, Rule>>
}) {
  const errors = []

  // go through every rule type we have
  for (const [type, typeRules] of Object.entries(rules)) {
    // find records of the given rule type
    const tRecords = records
      .filter((rec) => rec.type === type)
      .map((r) => r.content)

    // for each of those records, generate a list of rule violations
    for (const [recordIdx, record] of tRecords.entries()) {
      let recordErrors: ValidationError[]
      try {
        // TODO: Consider refactoring this to take better advantage of async parallelization
        // eslint-disable-next-line no-await-in-loop
        recordErrors = await validateRecord({ upload, record, typeRules })
      } catch (e) {
        recordErrors = [
          new ValidationError(
            `unexpected error validating record: ${e.message}`
          ),
        ]
      }

      // special sub-recipient validation
      try {
        if (type === 'subrecipient') {
          recordErrors = [
            ...recordErrors,
            // TODO: Consider refactoring this to take better advantage of async parallelization
            // eslint-disable-next-line no-await-in-loop
            ...(await validateSubrecipientRecord({
              upload,
              record,
              recordErrors,
            })),
          ]
        }
      } catch (e) {
        recordErrors = [
          ...recordErrors,
          new ValidationError(
            `unexpectedError validating subrecipient: ${e.message}`
          ),
        ]
      }

      // each rule violation gets assigned a row in a sheet; they already set their column
      recordErrors.forEach((error) => {
        error.tab = type
        error.row = 13 + recordIdx // TODO: how do we know the data starts at row 13?

        // save each rule violation in the overall list
        errors.push(error)
      })
    }
  }

  return errors
}

async function validateUpload(upload: Upload, user, trns = null) {
  // holder for our validation errors
  const errors = []

  // holder for post-validation functions

  // grab the records
  const records = await recordsForUpload(upload)

  // grab the rules
  const rules = await getRules()

  // list of all of our validations
  const validations = [
    validateVersion,
    validateProjectUseCode,
    // validateEcCode,
    validateRules,
    // validateReferences,
  ]

  // we should do this in a transaction, unless someone is doing it for us
  const ourTransaction = !trns
  if (ourTransaction) {
    // TODO: do this with prisma
    // trns = await knex.transaction()
  }

  // run validations, one by one
  for (const validation of validations) {
    try {
      // TODO: Consider refactoring this to take better advantage of async parallelization
      // eslint-disable-next-line no-await-in-loop
      errors.push(
        await validation({
          upload,
          records,
          rules,
        })
      )
    } catch (e) {
      errors.push(
        new ValidationError(`validation ${validation.name} failed: ${e}`)
      )
    }
  }

  // flat list without any nulls, including errors and warnings
  const flatErrors = errors.flat().filter((x) => x)

  // tab should be sheet name, not sheet type
  for (const error of flatErrors) {
    error.tab = TYPE_TO_SHEET_NAME[error.tab] || error.tab
  }

  // fatal errors determine if the upload fails validation
  const fatal = flatErrors.filter((x) => x.severity === 'err')
  const validated = fatal.length === 0

  // if we successfully validated for the first time, let's mark it!
  if (validated && !upload.validatedAt) {
    try {
      await markValidated(upload.id, user.id)
    } catch (e) {
      errors.push(new ValidationError(`failed to mark upload: ${e.message}`))
    }
  }

  // depending on whether we validated or not, lets commit/rollback. we MUST do
  // this or bad things happen. this is why there are try/catch blocks around
  // every other function call above here
  if (ourTransaction) {
    const finishTrns = validated ? trns.commit : trns.rollback
    await finishTrns()
    // TODO: make this work with prisma
    // trns = knex
  }

  // if it was valid before but is no longer valid, clear it; this happens outside the transaction
  if (!validated && upload.validatedAt) {
    await markInvalidated(upload.id, trns)
  }

  // finally, return our errors
  return flatErrors
}

async function invalidateUpload(upload: Upload, user, trns = null) {
  const errors = []

  const ourTransaction = !trns
  if (ourTransaction) {
    // TODO: do this with prisma
    // trns = await knex.transaction()
  }

  // if we successfully validated for the first time, let's mark it!
  try {
    await markInvalidated(upload.id, user.id)
  } catch (e) {
    errors.push(new ValidationError(`failed to mark upload: ${e.message}`))
  }

  // depending on whether we validated or not, lets commit/rollback. we MUST do
  // this or bad things happen. this is why there are try/catch blocks around
  // every other function call above here
  if (ourTransaction) {
    // TODO: do this with prisma
    // await trns.commit()
    // trns = knex
  }

  // finally, return our errors
  return errors
}

export { validateUpload, invalidateUpload }
