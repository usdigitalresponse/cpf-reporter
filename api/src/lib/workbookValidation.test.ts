import { ValidationError } from 'src/lib/validation-error'
import { getRules } from 'src/lib/validation-rules'
import {
  validateProjectUseCode,
  validateRecord,
  validateVersion,
  WorkbookRecord,
} from 'src/lib/workbookValidation'

const translateRecords = (records: WorkbookRecord[], type: string | number) =>
  records.filter((rec) => rec.type === type).map((r) => r.content)
const rules = getRules()

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
        const records = [{ type: 'logic', upload: { id: 1 } }]
        // Seems important enough to supply a specific error in case we don't have a "content" object
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        actualResult = validateVersion({ records, rules })
      })
      it('should return ValidationError', () => {
        expect(actualResult).toEqual(
          new ValidationError('Logic record is missing "content"')
        )
      })
    })
    describe('when "logic" content is missing version', () => {
      beforeEach(() => {
        const records = [{ type: 'logic', content: {}, upload: { id: 1 } }]
        actualResult = validateVersion({ records, rules })
      })
      it('should return undefined', () => {
        expect(actualResult).toBeUndefined()
      })
    })
    describe('when version is older than the template', () => {
      beforeEach(() => {
        const records = [
          {
            type: 'logic',
            content: { version: 'v:20221212' },
            upload: { id: 1 },
          },
        ]
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
        const records = [
          {
            type: 'logic',
            content: { version: 'v:20241212' },
            upload: { id: 1 },
          },
        ]
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
        const records = [
          {
            type: 'logic',
            content: { version: 'v:20231212' },
          },
        ]
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
  describe('validateRecord', () => {
    let typeRules, record
    afterEach(() => {
      typeRules = undefined
      record = undefined
    })
    describe('required content', () => {
      beforeEach(() => {
        const translatedRecords = translateRecords(
          [
            {
              type: 'ec1',
              subcategory: '1A-Broadband Infrastructure',
              content: {
                some: 'thing',
              },
            },
          ],
          'ec1'
        )
        record = translatedRecords[0]
        typeRules = rules['ec1']
      })
      describe('when a required key item is missing', () => {
        it('should return ValidationError', () => {
          expect(validateRecord({ record, typeRules })).toEqual(
            expect.arrayContaining([
              new ValidationError('Value is required for Project_Name__c'),
            ])
          )
        })
      })
      describe('when an optional key item is missing', () => {
        it('should not have error for missing item', () => {
          expect(validateRecord({ record, typeRules })).not.toEqual(
            expect.arrayContaining([
              new ValidationError(
                'Value is required for Additional_Address__c'
              ),
            ])
          )
        })
      })
    })
    describe('listVals content', () => {
      describe('when a listValue does not match', () => {
        beforeEach(() => {
          const translatedRecords = translateRecords(
            [
              {
                type: 'ec1',
                subcategory: '1A-Broadband Infrastructure',
                content: {
                  Matching_Funds__c: 'Hello World',
                },
              },
            ],
            'ec1'
          )
          record = translatedRecords[0]
          typeRules = rules['ec1']
        })
        it('should return a "one of" ValidationError', () => {
          const errors = validateRecord({ record, typeRules })
          expect(errors).toEqual(
            expect.arrayContaining([
              new ValidationError(
                "Value for Matching_Funds__c ('hello world') must be one of 2 options in the input template"
              ),
            ])
          )
        })
      })
    })
    describe('currency', () => {
      describe('when the value does not match the currency type', () => {
        it('should have error for invalid currency', () => {
          const translatedRecords = translateRecords(
            [
              {
                type: 'ec1',
                subcategory: '1A-Broadband Infrastructure',
                content: {
                  Total_from_all_funding_sources__c: 'hello world',
                },
              },
            ],
            'ec1'
          )
          record = translatedRecords[0]
          typeRules = rules['ec1']
          expect(validateRecord({ record, typeRules })).toEqual(
            expect.arrayContaining([
              new ValidationError(
                'Data entered in cell is "hello world", but it must be a number with at most 2 decimals'
              ),
            ])
          )
        })
      })
      describe('when the value is a valid currency', () => {
        it('should not have error for invalid currency', () => {
          const translatedRecords = translateRecords(
            [
              {
                type: 'ec1',
                subcategory: '1A-Broadband Infrastructure',
                content: {
                  Total_from_all_funding_sources__c: 1234.98,
                },
              },
            ],
            'ec1'
          )
          record = translatedRecords[0]
          typeRules = rules['ec1']
          expect(validateRecord({ record, typeRules })).not.toEqual(
            expect.arrayContaining([
              new ValidationError(
                'Data entered in cell is "hello world", but it must be a number with at most 2 decimals'
              ),
            ])
          )
        })
      })
    })
    describe('date', () => {
      describe('when the value does not match the date type', () => {
        it('should have error for invalid Date', () => {
          const translatedRecords = translateRecords(
            [
              {
                type: 'ec1',
                subcategory: '1A-Broadband Infrastructure',
                content: {
                  Projected_Con_Start_Date__c: 'hello world',
                },
              },
            ],
            'ec1'
          )
          record = translatedRecords[0]
          typeRules = rules['ec1']
          expect(validateRecord({ record, typeRules })).toEqual(
            expect.arrayContaining([
              new ValidationError(
                'Data entered in cell is "hello world", which is not a valid date.'
              ),
            ])
          )
        })
      })
      describe('when the value is a valid Date', () => {
        it('should not have error for invalid Date', () => {
          const translatedRecords = translateRecords(
            [
              {
                type: 'ec1',
                subcategory: '1A-Broadband Infrastructure',
                content: {
                  Projected_Con_Start_Date__c: 1478148420000,
                },
              },
            ],
            'ec1'
          )
          record = translatedRecords[0]
          typeRules = rules['ec1']
          expect(validateRecord({ record, typeRules })).not.toEqual(
            expect.arrayContaining([
              new ValidationError(
                'Data entered in cell is "1478148420000", which is not a valid date.'
              ),
            ])
          )
        })
      })
    })
    describe('String', () => {
      describe('when the POC_Email_Address__c is not a valid email', () => {
        it('should have the Email validation error', () => {
          const translatedRecords = translateRecords(
            [
              {
                type: 'subrecipient',
                subcategory: '1A-Broadband Infrastructure',
                content: {
                  POC_Email_Address__c: 'Hello.World',
                },
              },
            ],
            'subrecipient'
          )
          record = translatedRecords[0]
          typeRules = rules['subrecipient']
          const errors = validateRecord({ record, typeRules })
          expect(errors).toEqual(
            expect.arrayContaining([
              new ValidationError(
                'Value entered in cell is "Hello.World". Email must be of the form "user@email.com"'
              ),
            ])
          )
        })
      })
      describe('when the POC_Email_Address__c is a valid email', () => {
        it('should not have the "email format" error', () => {
          const translatedRecords = translateRecords(
            [
              {
                type: 'subrecipient',
                subcategory: '1A-Broadband Infrastructure',
                content: {
                  POC_Email_Address__c: 'foo@example.com',
                },
              },
            ],
            'subrecipient'
          )
          record = translatedRecords[0]
          typeRules = rules['subrecipient']
          expect(validateRecord({ record, typeRules })).not.toEqual(
            expect.arrayContaining([
              new ValidationError(
                'Value entered in cell is "foo@example.com". Email must be of the form "user@email.com"'
              ),
            ])
          )
        })
      })
    })
    describe('Numeric', () => {
      describe('when the Total_Miles_Planned__c is not a valid number', () => {
        it('should have the numeric validation error', () => {
          const translatedRecords = translateRecords(
            [
              {
                type: 'ec1',
                subcategory: '1A-Broadband Infrastructure',
                content: {
                  Total_Miles_Planned__c: 'Hello.World',
                },
              },
            ],
            'ec1'
          )
          record = translatedRecords[0]
          typeRules = rules['ec1']
          const errors = validateRecord({ record, typeRules })
          expect(errors).toEqual(
            expect.arrayContaining([
              new ValidationError(
                "Expected a number, but the value was 'Hello.World'"
              ),
            ])
          )
        })
      })
      describe('when the Total_Miles_Planned__c is a valid number', () => {
        it('should not have the "Expected a number" error', () => {
          const translatedRecords = translateRecords(
            [
              {
                type: 'ec1',
                subcategory: '1A-Broadband Infrastructure',
                content: {
                  Total_Miles_Planned__c: 42,
                },
              },
            ],
            'ec1'
          )
          record = translatedRecords[0]
          typeRules = rules['ec1']
          expect(validateRecord({ record, typeRules })).not.toEqual(
            expect.arrayContaining([
              new ValidationError("Expected a number, but the value was '42'"),
            ])
          )
        })
      })
    })
    describe('maxLength', () => {
      describe('when the Zip_Code_Planned__c is greater than maxLength', () => {
        it('should have the maxLength validation error', () => {
          const translatedRecords = translateRecords(
            [
              {
                type: 'ec1',
                subcategory: '1A-Broadband Infrastructure',
                content: {
                  Zip_Code_Planned__c: 'asdf_asdf_asdf',
                },
              },
            ],
            'ec1'
          )
          record = translatedRecords[0]
          typeRules = rules['ec1']
          const errors = validateRecord({ record, typeRules })
          expect(errors).toEqual(
            expect.arrayContaining([
              new ValidationError(
                'Value for Zip_Code_Planned__c cannot be longer than 5 (currently, 14)'
              ),
            ])
          )
        })
      })
      describe('when the Zip_Code_Planned__c is less than maxLength', () => {
        it('should not have the "Expected a number" error', () => {
          const translatedRecords = translateRecords(
            [
              {
                type: 'ec1',
                subcategory: '1A-Broadband Infrastructure',
                content: {
                  Zip_Code_Planned__c: 'asdf',
                },
              },
            ],
            'ec1'
          )
          record = translatedRecords[0]
          typeRules = rules['ec1']
          expect(validateRecord({ record, typeRules })).not.toEqual(
            expect.arrayContaining([
              new ValidationError(
                'Value for Zip_Code_Planned__c cannot be longer than 5 (currently, 4)'
              ),
            ])
          )
        })
      })
    })
  })
})
