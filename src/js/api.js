export async function apiRequest(path, options = {}) {
  let response;

  try {
    response = await fetch(path, options);
  } catch (error) {
    throw new Error('Cannot reach the service right now. Check that the PHP API is running.');
  }

  let result;
  try {
    result = await response.json();
  } catch (error) {
    throw new Error('The server returned an invalid response. Please try again later.');
  }

  if (!response.ok) {
    throw new Error(result.error || 'The request could not be completed.');
  }

  return result.data;
}
