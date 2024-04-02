function apiResponse(
  res,
  status,
  message,
  data = null,
  errors = null,
  statusCode = null
) {
  if (status === 'success') {
    statusCode = statusCode || 200;
  } else if (status === 'error') {
    statusCode = statusCode || 400;
  }

  const response = {
    message,
  };

  console.log('apiResponse data:', data);

  if (data) {
    response.data = data;
  }

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
}

module.exports = apiResponse;
