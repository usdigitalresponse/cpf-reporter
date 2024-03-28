import { upload } from '../uploads'

import { createUploadValidation } from './uploadValidations'
import { StandardScenario } from './uploadValidations.scenarios'

describe('upload validations', () => {
  scenario(
    'throws on duplicate null results upload creation',
    async (scenario: StandardScenario) => {
      const uploadResult = await upload({ id: scenario.upload.one.id })

      await createUploadValidation({
        input: {
          uploadId: uploadResult.id,
          passed: false,
          initiatedById: uploadResult.uploadedById,
        },
      })
      expect(
        async () =>
          await createUploadValidation({
            input: {
              uploadId: uploadResult.id,
              passed: false,
              initiatedById: uploadResult.uploadedById,
            },
          })
      ).rejects.toThrow('Unique constraint failed on the fields: (`uploadId`)')
    }
  )
})
