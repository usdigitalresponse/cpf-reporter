export type FormatterFunction = (value: string | number) => string | number

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
  isRequiredFn?: (value: WorkbookContentItem) => boolean
  validationFormatters: FormatterFunction[]
}

export type WorkbookContentItem = Record<string, string | number>

export type WorkbookRecord = {
  type: string
  content: WorkbookContentItem
  subcategory?: string
}
