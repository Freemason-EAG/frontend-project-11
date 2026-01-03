import render from './view.js'
import urlValidator from './validator.js'
import onChange from 'on-change'

const createFeed = url => ({
  id: new Date().toISOString(),
  url,
})

const isDupl = (feeds, url) => feeds.some(feed => feed.url === url)

const updateTextlang = (i18n) => {
  document.querySelector('h1').textContent = i18n.t('header.title')
  document.querySelector('header p').textContent = i18n.t('header.subtitle')
  document.querySelector('label[for="url-input"]').textContent = i18n.t('form.label')
  document.querySelector('button[type="submit"]').textContent = i18n.t('form.button')
  document.querySelector('small code').textContent = i18n.t('form.example')
  document.querySelector('#url-input').placeholder = i18n.t('form.placeholder')
  document.querySelector('h2').textContent = i18n.t('sections.posts')
}

const handlerForm = (watchedState, i18nInstance, input) => {
  const { urlForm, feeds } = watchedState
  const urlInput = document.querySelector('#url-input')
  urlForm.errors = []
  urlValidator(input)
    .then(() => {
      if (isDupl(feeds, input)) {
        throw new Error(i18nInstance.t('errors.duplicate'))
      }
      else {
        feeds.push(createFeed(input))

        urlForm.valid = true
        urlForm.errors = []
        urlInput.value = ''
        urlInput.focus()
      }
    })
    .catch ((e) => {
      urlForm.errors = [e.message]
      urlForm.valid = false
      urlInput.focus()
    })
}

const app = ({ i18nInstance, state }) => {
  const form = document.querySelector('#rss-form')

  updateTextlang(i18nInstance)

  const watchedState = onChange(state, () => {
    render(state, i18nInstance)
  })

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const input = String(formData.get('url')).trim()
    handlerForm(watchedState, i18nInstance, input)
  })
  render(watchedState, i18nInstance)
  return watchedState
}

export default app
