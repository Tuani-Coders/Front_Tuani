import { createI18n } from 'vue-i18n'
import es from './locales/es.json'
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

export default i18n
