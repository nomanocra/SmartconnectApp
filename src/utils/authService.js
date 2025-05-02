import { ref } from 'vue'
import { config } from '@/utils/config'
// On crée des références réactives pour stocker le token et les infos utilisateur
const authToken = ref(localStorage.getItem('authToken') || null)
const user = ref(null)

export const useAuth = () => {
  // Fonction de connexion
  const login = async (credentials) => {
    try {
      const response = await fetch(`${config.apiTempUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        throw new Error('Échec de la connexion')
      }

      const data = await response.json()
      // Stockage du token et des données utilisateur
      authToken.value = data.token
      user.value = data.user
      localStorage.setItem('authToken', data.token)

      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Fonction de déconnexion
  const logout = () => {
    authToken.value = null
    user.value = null
    localStorage.removeItem('authToken')
  }

  // Vérification de l'état d'authentification
  const isAuthenticated = () => !!authToken.value

  return {
    login,
    logout,
    isAuthenticated,
    user,
    authToken,
  }
}
