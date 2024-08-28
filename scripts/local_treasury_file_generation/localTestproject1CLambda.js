exports.handler = async (event) => {
  console.log('Welcome to Project 1C Lambda')
  console.log('1C event', event)
  const response = {
    statusCode: 200,
    event,
  }

  console.log('Ending logs for Project 1C Lambda')
  return response
}
