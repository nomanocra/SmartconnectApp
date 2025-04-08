/**
 * Fetches data from a given URL with abort controller support
 *
 * @param {string} url - The URL to fetch posts from
 * @param {import('vue').Ref<Array>} data - Ref object to store the fetched data
 * @param {import('vue').Ref<string>|null} status - Ref object to track loading state ('loading', 'loaded', 'error')
 * @param {import('vue').Ref<AbortController|null>} abortController - Ref object to store the abort controller
 * @returns {void}
 */
export function fetchPosts(url, data, status, abortController) {
  if (abortController.value) {
    abortController.value.abort()
  }
  abortController.value = new AbortController()
  if (status) status.value = 'loading'
  fetch(url, { signal: abortController.value.signal })
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
      throw new Error('Cannot load article from the server')
    })
    .then((d) => {
      data.value = d
      if (status) status.value = 'loaded'
    })
    .catch((error) => {
      if (error.name !== 'AbortError') {
        console.error(error)
        if (status) status.value = 'error'
      }
    })
}

/**
 * Fetch data from an API with caching support
 * @param {string} url - The API URL to fetch from
 * @param {Ref} data - The reactive reference to store the data
 * @param {Ref} status - The reactive reference to store the status
 * @param {Ref} abortController - The abort controller reference
 * @param {string} cacheKey - The key to use for localStorage
 * @param {number} cacheDuration - The duration in milliseconds after which data is considered stale
 */
export const fetchPostWithCache = async (
  url,
  data,
  status,
  abortController,
  cacheKey,
  cacheDuration = 120 * 60 * 1000,
) => {
  // Try to get cached data first
  const cachedData = localStorage.getItem(cacheKey)
  let hasFreshData = false

  if (cachedData) {
    try {
      const { data: cachedValue, timestamp } = JSON.parse(cachedData)
      const isDataFresh = Date.now() - timestamp < cacheDuration

      if (isDataFresh) {
        data.value = cachedValue
        status.value = 'loaded'
        hasFreshData = true
      }
    } catch (error) {
      console.error('Error parsing cached data:', error)
      localStorage.removeItem(cacheKey)
    }
  }

  if (!hasFreshData) {
    console.log('Fetching fresh data from API for', cacheKey)
    status.value = 'loading'
  }

  // Cancel the previous request if it exists
  if (abortController.value) {
    abortController.value.abort()
  }

  // Initialize a new abort controller
  abortController.value = new AbortController()

  // Call the API
  fetch(url, { signal: abortController.value.signal })
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
      throw new Error('Cannot load article from the server')
    })
    .then((d) => {
      data.value = d
      localStorage.setItem(cacheKey, JSON.stringify({ data: d, timestamp: Date.now() }))
      status.value = 'loaded'
    })
    .catch((error) => {
      if (error.name !== 'AbortError') {
        console.error('Error fetching data for', cacheKey, ':', error)
        status.value = 'error'
      } else {
        console.warn('Request aborded and relaunch for', cacheKey, ':', error)
      }
    })
}
