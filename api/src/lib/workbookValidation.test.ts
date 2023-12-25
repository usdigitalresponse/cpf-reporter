import { ValidationError } from 'src/lib/validation-error'
import { validateVersion } from 'src/lib/workbookValidation'

const rules = {
  logic: { version: { version: 'v:20231212', columnName: 'B' } },
}

describe('workbookValidation tests', () => {
  let actualResult: unknown
  afterEach(() => {
    actualResult = null
  })
  describe('validateVersion', () => {
    describe('when "logic" record does not exist', () => {
      beforeEach(async () => {
        const records = []
        actualResult = await validateVersion({ records, rules })
      })
      it('should return ValidationError', () => {
        expect(actualResult).toEqual(
          new ValidationError('Upload is missing Logic record')
        )
      })
    })
    describe('when "logic" record is missing content', () => {
      beforeEach(async () => {
        const records = [{ type: 'logic' }]
        actualResult = await validateVersion({ records, rules })
      })
      it('should return ValidationError', () => {
        expect(actualResult).toEqual(
          new ValidationError('Logic record is missing "content"')
        )
      })
    })
    // TODO ARPA doesn't return an error when "version" is undefined
    describe.skip('when "logic" content is is missing version', () => {
      beforeEach(async () => {
        const records = [{ type: 'logic', content: {} }]
        actualResult = await validateVersion({ records, rules })
      })
      it('should return ValidationError', () => {
        expect(actualResult).toEqual(
          new ValidationError('Logic sheet is missing "version"')
        )
      })
    })
    describe('when version is older than the template', () => {
      beforeEach(async () => {
        const records = [{ type: 'logic', content: { version: 'v:20221212' } }]
        actualResult = await validateVersion({ records, rules })
      })
      it('should return ValidationError', () => {
        expect(actualResult).toEqual(
          new ValidationError(
            'Upload template version (v:20221212) is older than the latest input template (v:20231212)'
          )
        )
      })
    })
    describe('when version is newer than the template', () => {
      beforeEach(async () => {
        const records = [{ type: 'logic', content: { version: 'v:20241212' } }]
        actualResult = await validateVersion({ records, rules })
      })
      it('should return ValidationError', () => {
        expect(actualResult).toEqual(
          new ValidationError(
            'Upload template version (v:20241212) is newer than the latest input template (v:20231212)'
          )
        )
      })
    })
    describe('when versions match', () => {
      beforeEach(async () => {
        const records = [{ type: 'logic', content: { version: 'v:20231212' } }]
        actualResult = await validateVersion({ records, rules })
      })
      it('should return ValidationError', () => {
        expect(actualResult).toBeUndefined()
      })
    })
  })
})
