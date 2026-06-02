import { createI18n } from 'vue-i18n'
import es from './locales/es.json'
<<<<<<< HEAD
import en from './locales/en.json'
import fr from './locales/fr.json'
import eu from './locales/eu.json'
import ar from './locales/ar.json'

const messages = { es, en, fr, eu, ar }

const i18n = createI18n({
  legacy: false,
  locale: 'es',
  fallbackLocale: 'es',
  messages
})

=======
import eu from './locales/eu.json'
import en from './locales/en.json'

export const SUPPORTED_LOCALES = ['es', 'eu', 'en']
export const DEFAULT_LOCALE = 'es'
export const LOCALE_STORAGE_KEY = 'tuani-locale'

const getInitialLocale = () => {
  let storedLocale = null

  try {
    storedLocale = window.localStorage?.getItem(LOCALE_STORAGE_KEY)
  } catch {
    storedLocale = null
  }

  if (SUPPORTED_LOCALES.includes(storedLocale)) {
    return storedLocale
  }

  const browserLocale = navigator.language?.split('-')[0]

  if (SUPPORTED_LOCALES.includes(browserLocale)) {
    return browserLocale
  }

  return DEFAULT_LOCALE
}

const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: DEFAULT_LOCALE,
  globalInjection: true,
  messages: {
    es,
    eu,
    en
  }
})

export const setLocale = (locale) => {
  if (!SUPPORTED_LOCALES.includes(locale)) {
    return
  }

  i18n.global.locale.value = locale

  try {
    window.localStorage?.setItem(LOCALE_STORAGE_KEY, locale)
  } catch {
    // Keep the language switch working even if storage is unavailable.
  }

  document.documentElement.lang = locale
}

document.documentElement.lang = i18n.global.locale.value

>>>>>>> f610b64b49f7ba410878bc7dbb93d6e23726a750
export default i18n
