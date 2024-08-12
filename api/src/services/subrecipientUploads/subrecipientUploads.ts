import type {
  QueryResolvers,
  MutationResolvers,
  SubrecipientUploadRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const subrecipientUploads: QueryResolvers['subrecipientUploads'] =
  () => {
    return db.subrecipientUpload.findMany()
  }

export const subrecipientUpload: QueryResolvers['subrecipientUpload'] = ({
  id,
}) => {
  return db.subrecipientUpload.findUnique({
    where: { id },
  })
}

export const createSubrecipientUpload: MutationResolvers['createSubrecipientUpload'] =
  ({ input }) => {
    return db.subrecipientUpload.create({
      data: input,
    })
  }

export const updateSubrecipientUpload: MutationResolvers['updateSubrecipientUpload'] =
  ({ id, input }) => {
    return db.subrecipientUpload.update({
      data: input,
      where: { id },
    })
  }

export const deleteSubrecipientUpload: MutationResolvers['deleteSubrecipientUpload'] =
  ({ id }) => {
    return db.subrecipientUpload.delete({
      where: { id },
    })
  }

const parseRawSubrecipient = (rawData) => {
  return {
    name: rawData.Name || '',
    recipientId: rawData.Recipient_Profile_ID__c || '',
    pocName: rawData.POC_Name__c || '',
    pocPhoneNumber: rawData.POC_Phone_Number__c || '',
    pocEmailAddress: rawData.POC_Email_Address__c || '',
    zip5: rawData.Zip__c || '',
    zip4: rawData.Zip_4__c !== 'null' ? rawData.Zip_4__c : '',
    addressLine1: rawData.Address__c || '',
    addressLine2: rawData.Address_2__c !== 'null' ? rawData.Address_2__c : '',
    addressLine3: rawData.Address_3__c !== 'null' ? rawData.Address_3__c : '',
    city: rawData.City__c || '',
    state: rawData.State_Abbreviated__c || '',
  }
}

export const SubrecipientUpload: SubrecipientUploadRelationResolvers = {
  parsedSubrecipient: (_obj, { root }) => {
    return parseRawSubrecipient(root.rawSubrecipient)
  },
  subrecipient: (_obj, { root }) => {
    return db.subrecipientUpload
      .findUnique({ where: { id: root?.id } })
      .subrecipient()
  },
  upload: (_obj, { root }) => {
    return db.subrecipientUpload
      .findUnique({ where: { id: root?.id } })
      .upload()
  },
}
