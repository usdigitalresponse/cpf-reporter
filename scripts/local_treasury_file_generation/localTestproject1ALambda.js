exports.handler = async (event) => {
  console.log('Welcome to Project 1A Lambda')
  console.log('1A event', event)
  const response = {
    statusCode: 200,
    event,
  }

  console.log('Ending logs for Project 1A Lambda')
  return response
}
