import type {
  QueryResolvers,
  MutationResolvers,
  SubrecipientRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const subrecipients: QueryResolvers['subrecipients'] = () => {
  const currentUser = context.currentUser

  return db.subrecipient.findMany({
    where: {
      organizationId: currentUser.agency.organizationId,
    },
  })
}

export const subrecipient: QueryResolvers['subrecipient'] = ({ id }) => {
  return db.subrecipient.findUnique({
    where: { id },
  })
}

export const createSubrecipient: MutationResolvers['createSubrecipient'] = ({
  input,
}) => {
  return db.subrecipient.create({
    data: input,
  })
}

export const updateSubrecipient: MutationResolvers['updateSubrecipient'] = ({
  id,
  input,
}) => {
  return db.subrecipient.update({
    data: input,
    where: { id },
  })
}

export const deleteSubrecipient: MutationResolvers['deleteSubrecipient'] = ({
  id,
}) => {
  return db.subrecipient.delete({
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

export const Subrecipient: SubrecipientRelationResolvers = {
  organization: (_obj, { root }) => {
    return db.subrecipient
      .findUnique({ where: { id: root?.id } })
      .organization()
  },
  subrecipientUploads: (_obj, { root }) => {
    return db.subrecipient
      .findUnique({ where: { id: root?.id } })
      .subrecipientUploads()
  },
  latestSubrecipientUpload: async (_obj, { root }) => {
    console.log('root is  ', root)
    const latestSubrecipientUpload = await db.subrecipientUpload.findFirst({
      where: { subrecipientId: root?.id },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // TODO: Parse the latestSubrecipientUpload.rawSubrecipient JSON string into an object
    if (latestSubrecipientUpload && latestSubrecipientUpload.rawSubrecipient) {
      const parsedData = parseRawSubrecipient(
        latestSubrecipientUpload.rawSubrecipient
      )
      return {
        ...latestSubrecipientUpload,
        parsedSubrecipient: parsedData,
      }
    }

    return latestSubrecipientUpload
  },
}
