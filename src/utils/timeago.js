import i18nSettings from '@/lang/i18n-settings'
import { ref, readonly } from 'vue'

/**
 * Convertit une date en format "time ago" localisé
 * @param {Date|string|number} date - La date à convertir
 * @param {string} locale - La langue à utiliser ('fr' ou 'en')
 * @returns {string} Le temps écoulé formaté selon la langue spécifiée
 */
export function timeago(date, locale = 'en') {
  // Convertir la date en objet Date si ce n'est pas déjà le cas
  const targetDate = new Date(date)
  const now = new Date()

  // Calculer la différence en millisecondes
  const diffInMs = now - targetDate

  // Fonction helper pour obtenir la traduction
  const getTranslation = (key) => {
    const translations = i18nSettings[locale]?.timeago || i18nSettings.en.timeago
    return translations[key] || key
  }

  // Si la date est dans le futur ou invalide, retourner "à l'instant"
  if (diffInMs < 0 || isNaN(diffInMs)) {
    return getTranslation('now')
  }

  // Convertir en secondes
  const diffInSeconds = Math.floor(diffInMs / 1000)

  // Fonction helper pour formater selon la langue
  const formatTimeAgo = (value, singularKey, pluralKey) => {
    const isSingular = value === 1
    const timeUnit = isSingular ? getTranslation(singularKey) : getTranslation(pluralKey)

    if (locale === 'fr') {
      // Format français: "il y a X minutes"
      return `il y a ${value} ${timeUnit}`
    } else {
      // Format anglais: "X minutes ago"
      return `${value} ${timeUnit} ago`
    }
  }

  // Moins d'une minute
  if (diffInSeconds < 60) {
    return formatTimeAgo(diffInSeconds, 'second', 'seconds')
  }

  // Convertir en minutes
  const diffInMinutes = Math.floor(diffInSeconds / 60)

  // Moins d'une heure
  if (diffInMinutes < 60) {
    return formatTimeAgo(diffInMinutes, 'minute', 'minutes')
  }

  // Convertir en heures
  const diffInHours = Math.floor(diffInMinutes / 60)

  // Moins d'un jour
  if (diffInHours < 24) {
    return formatTimeAgo(diffInHours, 'hour', 'hours')
  }

  // Convertir en jours
  const diffInDays = Math.floor(diffInHours / 24)

  // Moins d'un mois (approximativement 30 jours)
  if (diffInDays < 30) {
    return formatTimeAgo(diffInDays, 'day', 'days')
  }

  // Convertir en mois (approximativement)
  const diffInMonths = Math.floor(diffInDays / 30)

  // Moins d'un an
  if (diffInMonths < 12) {
    return formatTimeAgo(diffInMonths, 'month', 'months')
  }

  // Convertir en années
  const diffInYears = Math.floor(diffInMonths / 12)

  return formatTimeAgo(diffInYears, 'year', 'years')
}

/**
 * Version réactive de timeago qui se met à jour automatiquement
 * @param {Date|string|number} date - La date à convertir
 * @param {string} locale - La langue à utiliser ('fr' ou 'en')
 * @param {number} updateInterval - Intervalle de mise à jour en millisecondes (défaut: 60000 = 1 minute)
 * @returns {Object} Un objet avec la valeur actuelle et une méthode pour arrêter les mises à jour
 */
export function useTimeago(date, locale = 'en', updateInterval = 60000) {
  const currentValue = ref(timeago(date, locale))
  let intervalId = null

  const updateTimeago = () => {
    currentValue.value = timeago(date, locale)
  }

  const startUpdates = () => {
    if (intervalId) return

    intervalId = setInterval(updateTimeago, updateInterval)
    // Mettre à jour immédiatement
    updateTimeago()
  }

  const stopUpdates = () => {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  // Démarrer automatiquement
  startUpdates()

  return {
    value: readonly(currentValue),
    startUpdates,
    stopUpdates,
  }
}
