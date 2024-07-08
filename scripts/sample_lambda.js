/**
 * To build this, zip it using zip scripts/function.zip scripts/sample_lambda.js
 */
exports.handler = async (event) => {
  //console.log("EVENT: " + JSON.stringify(event));
  const response = {
    statusCode: 200,
    body: "Hello from my LocalStack Lambda function!\n" + event.input,
  };
  return response;
};
