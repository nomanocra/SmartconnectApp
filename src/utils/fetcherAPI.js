/**
 * Fetches data from a given URL with optional caching, abort controller, and status tracking
 *
 * @param {string} url - The URL to fetch data from
 * @param {Object} options - Optional parameters
 * @param {import('vue').Ref<Array>} options.response - Ref object to store the fetched response (required)
 * @param {string} [options.cacheKey] - The key to use for localStorage caching
 * @param {number} [options.cacheDuration] - The duration in milliseconds after which data is considered stale
 * @param {boolean} [options.requiresAuth] - Whether to include the authToken in the request headers
 * @param {import('vue').Ref<AbortController|null>} [options.abortController] - Ref object to store the abort controller
 * @param {import('vue').Ref<string>|null} [options.status] - Ref object to track loading state ('loading', 'loaded', 'error')
 * @param {string} [options.method] - HTTP method ('GET', 'POST', etc.)
 * @param {Object} [options.body] - Body to send for POST/PUT requests
 * @returns {void}
 *
 * Note: In case of error, the data ref will contain the error response object with the following structure:
 * {
 *   type: "/problems/conflict-error",
 *   title: "Resource Conflict",
 *   status: 409,
 *   detail: "This device is already associated with your account",
 *   instance: "/device/pull-data",
 *   timestamp: "2025-06-27T08:43:43.518Z",
 *   resourceType: "SmartDevice",
 *   deviceId: 18
 * }
 */
export default function fetchData(url, options = {}) {
  const {
    fetchedResponse,
    cacheKey,
    cacheDuration = 120 * 60 * 1000,
    requiresAuth = false,
    abortController = { value: null },
    status = { value: null },
    method = 'GET',
    body,
  } = options

  if (!fetchedResponse) {
    throw new Error('The "data" ref is required in options.')
  }

  // Try to get cached data first if cacheKey is provided
  if (cacheKey) {
    const cachedRes = localStorage.getItem(cacheKey)
    if (cachedRes) {
      try {
        const { data: cachedResponse, timestamp } = JSON.parse(cachedRes)
        const isDataFresh = Date.now() - timestamp < cacheDuration

        if (isDataFresh) {
          fetchedResponse.value = cachedResponse
          if (status.value) status.value = 'loaded'
        }
      } catch (error) {
        console.error('Error parsing cached data:', error)
        localStorage.removeItem(cacheKey)
      }
    }
  }

  // Cancel the previous request if it exists
  if (abortController.value) {
    abortController.value.abort()
  }
  abortController.value = new AbortController()
  if (status.value) status.value = 'loading'

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }

  // Add the auth token to the headers if the request requires authentication
  if (requiresAuth) {
    const authToken = localStorage.getItem('authToken')
    if (!authToken) {
      throw new Error("Le token d'authentification est requis mais non trouvé.")
    }
    headers['Authorization'] = `Bearer ${authToken}`
  }

  fetch(url, {
    method,
    signal: abortController.value.signal,
    mode: 'cors',
    credentials: 'include',
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
    .then(async (res) => {
      // Try to parse the response as JSON regardless of status
      let responseData = await res.json()

      if (res.ok) {
        // Success case - store the data
        fetchedResponse.value = responseData
        if (cacheKey) {
          localStorage.setItem(
            cacheKey,
            JSON.stringify({
              data: responseData,
              timestamp: Date.now(),
            }),
          )
        }
        if (status.value) status.value = 'loaded'
      } else {
        // Error case - store the error response
        fetchedResponse.value = responseData
        if (status.value) status.value = 'error'
        console.error('API Error:', responseData)
      }
    })
    .catch((error) => {
      if (error.name !== 'AbortError') {
        console.error('Network or parsing error:', error)
        // Create a generic error object for network errors
        fetchedResponse.value = {
          type: '/problems/network-error',
          title: 'Network Error',
          status: 0,
          detail: error.message || 'Network request failed',
          instance: url,
          timestamp: new Date().toISOString(),
        }
        if (status.value) status.value = 'error'
      }
    })
}
