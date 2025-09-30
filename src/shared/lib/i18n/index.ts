import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import { getBrowserLang, getCurrentLang } from '@/shared/utils/lang.utils'
import enGlobal from './en/global.json'
import esGlobal from './es/global.json'

const dictionary: Record<string, Record<string, string>> = {
  en: {
    ...enGlobal
  },
  es: {
    ...esGlobal
  }
}

const resources = {
  en: {
    translation: dictionary.en
  },
  es: {
    translation: dictionary.es
  }
}

export const useI18nInstance = () => {
  const i18nInstance = i18n.use(initReactI18next)

  i18nInstance
    .init({
      resources,
      lng: getCurrentLang(),
      fallbackLng: getBrowserLang(),
      debug: false,
      keySeparator: false,
      interpolation: {
        escapeValue: false
      }
    })
    .then(() => {
      const languages = Object.keys(dictionary)
      languages.forEach((lang) => {
        const resources = dictionary[lang]
        i18n.addResources(lang, 'translation', resources)
      })
    })

  return {
    i18nInstance
  }
}
