exports.handler = async (event) => {
  console.log('Welcome to Project 1B Lambda')
  console.log('1B event', event)
  const response = {
    statusCode: 200,
    event,
  }

  console.log('Ending logs for Project 1B Lambda')
  return response
}
