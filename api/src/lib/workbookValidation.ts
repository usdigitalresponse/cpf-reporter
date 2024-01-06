import projectUseCodes from 'src/lib/projectUseCodes'
import { ValidationError } from 'src/lib/validation-error'

export function validateProjectUseCode({ records }) {
  const coverRecord = records.find((record) => record?.type === 'cover')
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
  records: any[]
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
