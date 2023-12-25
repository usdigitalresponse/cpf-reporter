import { ValidationError } from 'src/lib/validation-error'
import {
  validateProjectUseCode,
  validateVersion,
} from 'src/lib/workbookValidation'

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
      beforeEach(() => {
        const records = []
        actualResult = validateVersion({ records, rules })
      })
      it('should return ValidationError', () => {
        expect(actualResult).toEqual(
          new ValidationError('Upload is missing Logic record')
        )
      })
    })
    describe('when "logic" record is missing content', () => {
      beforeEach(() => {
        const records = [{ type: 'logic' }]
        actualResult = validateVersion({ records, rules })
      })
      it('should return ValidationError', () => {
        expect(actualResult).toEqual(
          new ValidationError('Logic record is missing "content"')
        )
      })
    })
    // TODO ARPA doesn't return an error when "version" is undefined
    describe.skip('when "logic" content is is missing version', () => {
      beforeEach(() => {
        const records = [{ type: 'logic', content: {} }]
        actualResult = validateVersion({ records, rules })
      })
      it('should return ValidationError', () => {
        expect(actualResult).toEqual(
          new ValidationError('Logic sheet is missing "version"')
        )
      })
    })
    describe('when version is older than the template', () => {
      beforeEach(() => {
        const records = [{ type: 'logic', content: { version: 'v:20221212' } }]
        actualResult = validateVersion({ records, rules })
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
      beforeEach(() => {
        const records = [{ type: 'logic', content: { version: 'v:20241212' } }]
        actualResult = validateVersion({ records, rules })
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
      beforeEach(() => {
        const records = [{ type: 'logic', content: { version: 'v:20231212' } }]
        actualResult = validateVersion({ records, rules })
      })
      it('should return undefined', () => {
        expect(actualResult).toBeUndefined()
      })
    })
  })
  describe('validateProjectUseCode', () => {
    describe('when "cover" record does not exist', () => {
      beforeEach(() => {
        const records = []
        actualResult = validateProjectUseCode({ records })
      })
      it('should return ValidationError', () => {
        expect(actualResult).toEqual(
          new ValidationError('Upload is missing Cover record')
        )
      })
    })
    describe('when "cover" record is missing content', () => {
      beforeEach(() => {
        const records = [{ type: 'cover' }]
        actualResult = validateProjectUseCode({ records })
      })
      it('should return ValidationError', () => {
        expect(actualResult).toEqual(
          new ValidationError('Cover record is missing "content"')
        )
      })
    })
    describe('when "cover" record is missing "Project Use Code"', () => {
      beforeEach(() => {
        const records = [{ type: 'cover', content: {} }]
        actualResult = validateProjectUseCode({ records })
      })
      it('should return ValidationError', () => {
        expect(actualResult).toEqual(
          new ValidationError('Project Use Code must be set')
        )
      })
    })
    describe('when "Project Use Code" does not match any known Code', () => {
      beforeEach(() => {
        const records = [
          {
            type: 'cover',
            content: {
              'Project Use Code': 'hello world',
            },
          },
        ]
        actualResult = validateProjectUseCode({ records })
      })
      it('should return ValidationError', () => {
        expect(actualResult).toEqual(
          new ValidationError(
            'Record Project Use Code (hello world) from entry (hello world) does not match any known Project Use Code'
          )
        )
      })
    })
    describe('when valid "Project Use Code" presented', () => {
      beforeEach(() => {
        const records = [
          {
            type: 'cover',
            content: {
              'Project Use Code': '1A',
            },
          },
        ]
        actualResult = validateProjectUseCode({ records })
      })
      it('should return undefined', () => {
        expect(actualResult).toBeUndefined()
      })
    })
  })
})
