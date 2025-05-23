/**
 * Fetches data from a given URL with optional caching, abort controller, and status tracking
 *
 * @param {string} url - The URL to fetch data from
 * @param {Object} options - Optional parameters
 * @param {import('vue').Ref<Array>} options.data - Ref object to store the fetched data (required)
 * @param {string} [options.cacheKey] - The key to use for localStorage caching
 * @param {number} [options.cacheDuration] - The duration in milliseconds after which data is considered stale
 * @param {boolean} [options.requiresAuth] - Whether to include the authToken in the request headers
 * @param {import('vue').Ref<AbortController|null>} [options.abortController] - Ref object to store the abort controller
 * @param {import('vue').Ref<string>|null} [options.status] - Ref object to track loading state ('loading', 'loaded', 'error')
 * @param {string} [options.method] - HTTP method ('GET', 'POST', etc.)
 * @param {Object} [options.body] - Body to send for POST/PUT requests
 * @returns {void}
 */
export default function fetchData(url, options = {}) {
  const {
    data,
    cacheKey,
    cacheDuration = 120 * 60 * 1000,
    requiresAuth = false,
    abortController = { value: null },
    status = { value: null },
    method = 'GET',
    body,
  } = options

  if (!data) {
    throw new Error('The "data" ref is required in options.')
  }

  // Try to get cached data first if cacheKey is provided
  if (cacheKey) {
    const cachedData = localStorage.getItem(cacheKey)
    if (cachedData) {
      try {
        const { data: cachedValue, timestamp } = JSON.parse(cachedData)
        const isDataFresh = Date.now() - timestamp < cacheDuration

        if (isDataFresh) {
          data.value = cachedValue
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

  if (requiresAuth) {
    const authToken = localStorage.getItem('authToken')
    if (!authToken) {
      throw new Error('Le token d’authentification est requis mais non trouvé.')
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
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
      throw new Error('Cannot load data from the server')
    })
    .then((d) => {
      data.value = d
      if (cacheKey) {
        localStorage.setItem(cacheKey, JSON.stringify({ data: d, timestamp: Date.now() }))
      }
      if (status.value) status.value = 'loaded'
    })
    .catch((error) => {
      if (error.name !== 'AbortError') {
        console.error(error)
        if (status.value) status.value = 'error'
      }
    })
}
