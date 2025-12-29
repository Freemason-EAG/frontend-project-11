import i18next from 'i18next'

export default () => {
  const i18nInstance = i18next.createInstance()
  return i18nInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      // ru, // языки я импортирую и добавлю, как только подготовлю переводы
      // en,
    },
  })
    .then(() => {
      const state = {
        urlForm: {
          valid: false,
          errors: [],
        },
        feeds: [],
        posts: {},
        uiState: {
          networkProcess: 'filling', // 'sending', 'finished', 'failed'
          networkErrors: [],
        },
      }
      return { i18nInstance, state }
    })
}
