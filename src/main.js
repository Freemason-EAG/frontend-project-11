import './style.css'
import 'bootstrap'
import init from './init.js'
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

init()
  .then(({ i18nInstance, state }) => {
    updateTextlang(i18nInstance)

    const watchedState = onChange(state, () => {
      render(state, i18nInstance)
    })

    const form = document.querySelector('#rss-form')
    const urlInput = document.querySelector('#url-input')

    form.addEventListener('submit', (e) => {
      const { urlForm, feeds } = watchedState
      e.preventDefault()
      const formData = new FormData(e.target)
      const input = String(formData.get('url')).trim()
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
    })
    render(state, i18nInstance)
  })
  .catch((error) => {
    console.error('Ошибка инициализации', error)
  })
