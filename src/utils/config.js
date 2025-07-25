/**
 * Application configuration from environment variables
 */
export const config = {
  apiBaseUrl:
    import.meta.env.MODE === 'development'
      ? import.meta.env.VITE_API_BASE_URL_DEV
      : import.meta.env.VITE_API_BASE_URL_PROD || import.meta.env.VITE_API_BASE_URL,
  demoVersion: import.meta.env.VITE_DEMO_VERSION === 'true',
}

export default config
