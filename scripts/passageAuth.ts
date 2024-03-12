import { createPassageUser, deletePassageUser } from 'api/src/lib/auth'

/**
  * This script allows you to create or delete a user in the Passage API.

  * To create a user, run the following command:
  * yarn rw exec passageAuth --action create --email 'youremail@example.com'

  * To delete a user, run the following command:
  * yarn rw exec passageAuth --action delete --id 'yourUserId'
*/
export default async ({ args }) => {
  const { action, email, id } = args

  try {
    switch (action) {
      case 'create':
        const newUser = await createPassageUser(email)
        console.log('User successfully created:')
        console.log(newUser)
        break
      case 'delete':
        await deletePassageUser(id)
        console.log('User successfully deleted.')
        break
      default:
        console.log(
          `Unknown action: ${action}. Please use 'create' or 'delete'.`
        )
    }
  } catch (error) {
    console.error(`Error executing ${action} for Passage user:`, error)
  }
}
