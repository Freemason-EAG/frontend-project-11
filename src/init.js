import i18next from 'i18next'
import * as yup from 'yup'
import ru from './locales/ru.js'

export default () => {
  const i18nInstance = i18next.createInstance()
  return i18nInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  })
    .then (() => {
      yup.setLocale({
        mixed: {
          required: () => i18nInstance.t('errors.required'),
        },
        string: {
          url: () => i18nInstance.t('errors.url'),
        },
      })

      const state = {
        urlForm: {
          valid: false,
          errors: [],
        },
        feeds: {
          byId: {},
          allIds: [],
        },
        posts: {
          byId: {},
          allIds: [],
        },
        postsByFeedId: {},
        uiState: {
          networkProcess: 'filling', // 'sending', 'finished', 'failed'
          networkErrors: [],
        },
      }
      return { i18nInstance, state }
    })
}
