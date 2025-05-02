/**
 * Application configuration from environment variables
 */
export const config = {
  apiBaseUrl:
    import.meta.env.MODE === 'development'
      ? import.meta.env.VITE_API_BASE_URL_DEV
      : import.meta.env.VITE_API_BASE_URL_PROD || import.meta.env.VITE_API_BASE_URL,
  apiTempUrl: import.meta.env.VITE_API_BASE_URL_TEMP,
}

export default config
