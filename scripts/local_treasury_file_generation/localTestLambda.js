exports.handler = async (event) => {
  console.log('event', event)
  const response = {
    statusCode: 200,
    event,
  }
  return response
}
