import projectUseCodes from 'src/lib/projectUseCodes'
import { ValidationError } from 'src/lib/validation-error'

// Currency strings are must be at least one digit long (\d+)
// They can optionally have a decimal point followed by 1 or 2 more digits (?: \.\d{ 1, 2 })
const CURRENCY_REGEX_PATTERN = /^\d+(?: \.\d{ 1, 2 })?$/g

// Copied from www.emailregex.com
const EMAIL_REGEX_PATTERN =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const BETA_VALIDATION_MESSAGE =
  '[BETA] This is a new validation that is running in beta mode (as a warning instead of a blocking error). If you see anything incorrect about this validation, please report it at grants-helpdesk@usdigitalresponse.org'

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

export type Rule = {
  key: string
  index: number
  required: boolean | string
  dataType: string
  maxLength: number
  listVals: string[]
  columnName: string
  humanColName: string
  ecCodes: string[] | boolean
  version?: string
}

export interface TranslatedRule extends Rule {
  isRequiredFn?: (value: Record<string, string | number>) => boolean
  validationFormatters: any[]
}

export type WorkbookRecord = {
  type: string
  upload: { id: number }
  content: Record<string, string | number>
  subcategory?: string
}

export function validateProjectUseCode({ records }) {
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

export function validateVersion({
  records,
  rules,
}: {
  records: WorkbookRecord[]
  rules: { logic: { version: { version: string; columnName: string } } }
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
  // console.log(logicRecord)
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

function validateFieldPattern(fieldName, value) {
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

export function validateRecord({
  upload,
  record,
  typeRules,
}: {
  upload: unknown
  record: Record<string, string | number>
  typeRules: Record<string, TranslatedRule>
}) {
  const errors = []
  for (const [key, rule] of Object.entries(typeRules)) {
    const recordItem = record[key]
    if (
      [undefined, null].includes(recordItem) ||
      (typeof recordItem === 'string' && recordItem === '')
    ) {
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
    } else {
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

      if (rule.listVals.length > 0) {
        // enforce validation in lower case
        const lcItems = rule.listVals.map((val) => val.toLowerCase())

        // for pick lists, the value must be one of possible values
        if (
          rule.dataType === 'Pick List' &&
          !lcItems.includes(value.toString())
        ) {
          errors.push(
            new ValidationError(
              `Value for ${key} ('${value}') must be one of ${lcItems.length} options in the input template`,
              { col: rule.columnName, severity: 'err' }
            )
          )
        }

        // for multi select, all the values must be in the list of possible values
        if (rule.dataType === 'Multi-Select') {
          const entries = value
            .toString()
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
        const patternError = validateFieldPattern(key, value)
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
          // If this value is a string that can't be interpreted as a number, then error.
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
          String(record[key]).length > rule.maxLength
        ) {
          errors.push(
            new ValidationError(
              `Value for ${key} cannot be longer than ${
                rule.maxLength
              } (currently, ${String(record[key]).length})`,
              { col: rule.columnName, severity: 'err' }
            )
          )
        }
        // TODO: should we validate max length on currency? or numeric fields?
      }
    }
  }
  return errors
}
