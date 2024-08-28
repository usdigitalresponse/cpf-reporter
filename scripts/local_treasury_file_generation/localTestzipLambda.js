exports.handler = async (event) => {
  console.log('Welcome to Zip Lambda')
  console.log('zip event', event)
  const response = {
    statusCode: 200,
    event,
  }

  console.log('Ending logs for Zip Lambda')
  return response
}
