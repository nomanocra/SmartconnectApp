import { ref } from 'vue'
import { config } from '@/utils/config'
// On crée des références réactives pour stocker le token et les infos utilisateur
const authToken = ref(localStorage.getItem('authToken') || null)
const user = ref(null)

export const useAuth = () => {
  // Fonction de connexion
  const login = async (credentials) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/auth/login`, {
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
  const logout = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken.value}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Échec de la déconnexion')
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    } finally {
      // On nettoie toujours le state local même si l'appel API échoue
      authToken.value = null
      user.value = null
      localStorage.removeItem('authToken')
    }
  }

  // Vérification de l'état d'authentification
  const checkAuth = async () => {
    if (!authToken.value) return false

    try {
      const response = await fetch(`${config.apiBaseUrl}/auth/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken.value}`,
        },
      })

      if (!response.ok) {
        // Si le token n'est plus valide, on déconnecte l'utilisateur
        await logout()
        return false
      }

      const data = await response.json()
      user.value = data.user // Mise à jour des données utilisateur
      return true
    } catch (error) {
      console.error('Erreur lors de la vérification du token:', error)
      await logout()
      return false
    }
  }

  const isAuthenticated = async () => {
    return await checkAuth()
  }

  return {
    login,
    logout,
    isAuthenticated,
    checkAuth,
    user,
    authToken,
  }
}
