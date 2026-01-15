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
          readPostsIds: [],
        },
        modal: {
          isOpen: false,
          readPost: null,
        },
      }
      return { i18nInstance, state }
    })
}

// import i18next from 'i18next'
// import * as yup from 'yup'
// import ru from './locales/ru.js'

// export default () => {
//   const i18nInstance = i18next.createInstance()
//   return i18nInstance.init({
//     lng: 'ru',
//     debug: true,
//     resources: {
//       ru,
//     },
//   })
//     .then(() => {
//       document.querySelectorAll('[data-i18n]').forEach((tag) => {
//         tag.textContent = i18nInstance.t(tag.getAttribute('data-i18n'))
//       })
//       document.querySelectorAll('[data-i18n-placeholder]').forEach((tag) => {
//         tag.placeholder = i18nInstance.t(tag.getAttribute('data-i18n-placeholder'))
//       })
//       return i18nInstance
//     })
//     .then ((i18n) => {
//       yup.setLocale({
//         mixed: {
//           required: () => i18n.t('errors.required'),
//         },
//         string: {
//           url: () => i18n.t('errors.url'),
//         },
//       })

//       const state = {
//         urlForm: {
//           valid: false,
//           errors: [],
//         },
//         feeds: {
//           byId: {},
//           allIds: [],
//         },
//         posts: {
//           byId: {},
//           allIds: [],
//         },
//         postsByFeedId: {},
//         uiState: {
//           networkProcess: 'filling', // 'sending', 'finished', 'failed'
//           networkErrors: [],
//           readPostsIds: [],
//         },
//         modal: {
//           isOpen: false,
//           readPost: null,
//         },
//       }
//       return { i18nInstance: i18n, state }
//     })
// }
