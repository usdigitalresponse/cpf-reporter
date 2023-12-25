import { ValidationError } from 'src/lib/validation-error'

export async function validateVersion({
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
  const { version } = logicRecord.content

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
