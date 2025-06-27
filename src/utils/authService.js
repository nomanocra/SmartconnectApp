import { ref } from 'vue'
import { config } from '@/utils/config'
import { t } from '@/utils/i18n'
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
        if (response.status === 401 || response.status === 403) {
          // Identifiants invalides
          return { success: false, errorType: 'auth', error: t('login.loginAuthError') }
        } else {
          // Autre erreur serveur
          const errorRes = await response.json()
          return {
            success: false,
            errorType: 'other',
            error: `${errorRes.title}: ${errorRes.detail} (${errorRes.status})`,
          }
        }
      }

      const res = await response.json()
      // Stockage du token et des données utilisateur
      authToken.value = res.data.token
      user.value = res.data.user
      localStorage.setItem('authToken', res.data.token)
      return { success: true }
    } catch (error) {
      console.error(error)
      // Erreur réseau ou CORS
      return {
        success: false,
        errorType: 'server',
        error: t('login.loginServerError'),
      }
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
        // Erreur serveur
        const errorRes = await response.json()
        return {
          success: false,
          errorType: 'other',
          error: `${errorRes.title}: ${errorRes.detail} (${errorRes.status})`,
        }
      }
      // Succès
      return { success: true }
    } catch (error) {
      // Erreur réseau ou CORS
      return { success: false, errorType: 'server', error: error.message }
    } finally {
      // On nettoie toujours le state local même si l'appel API échoue
      authToken.value = null
      user.value = null
      localStorage.removeItem('authToken')
    }
  }

  // Vérification de l'état d'authentification
  const checkAuth = async () => {
    if (!authToken.value) return { success: false, errorType: 'no_token', error: 'Aucun token' }

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
        if (response.status === 401 || response.status === 403) {
          return { success: false, errorType: 'auth', error: 'Token invalide ou expiré' }
        }
        const errorData = await response.json()
        return {
          success: false,
          errorType: 'other',
          error: `${errorData.title}: ${errorData.detail} (${errorData.status})`,
        }
      }

      const res = await response.json()
      user.value = res.data.user // Mise à jour des données utilisateur
      return { success: true, user: res.data.user }
    } catch (error) {
      await logout()
      return { success: false, errorType: 'server', error: error.message }
    }
  }

  // Fonction simplifiée pour vérifier si l'utilisateur est authentifié sans retourner le type d'erreur.
  const isAuthenticated = async () => {
    const { success } = await checkAuth()
    return success
  }

  const getUserInfo = async () => {
    const response = await fetch(`${config.apiBaseUrl}/auth/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken.value}`,
      },
    })
    const res = await response.json()
    return res.data
  }

  return {
    login,
    logout,
    isAuthenticated,
    getUserInfo,
    checkAuth,
    user,
    authToken,
  }
}
