/**
 * Application configuration from environment variables
 */
export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL_PROD || import.meta.env.VITE_API_BASE_URL,
}
