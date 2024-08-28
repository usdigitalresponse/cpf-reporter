exports.handler = async (event) => {
  console.log('Welcome to Subrecipient Lambda')
  console.log('Subrecipient event', event)
  const response = {
    statusCode: 200,
    event,
  }

  console.log('Ending logs for Subrecipient Lambda')
  return response
}
