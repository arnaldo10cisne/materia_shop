exports.lambda_handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  const response = {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ message: "Hello from lambda" }),
  };

  return response;
};
