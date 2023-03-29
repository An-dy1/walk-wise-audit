export default function apiResponse(
  res,
  status,
  message,
  data = null,
  errors = null
) {
  const response = {
    status,
    message,
  };

  if (data) {
    response.data = data;
  }

  if (errors) {
    response.errors = errors;
  }

  res.status(status === 'success' ? 200 : 400).json(response);
}
