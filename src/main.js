import './style.css'
import 'bootstrap'
import state from './state.js'
import render from './view.js'
import urlValidator from './validator.js'
import onChange from 'on-change'

const watchedState = onChange(state, () => {
  render(state)
})

const createFeed = url => ({
  id: new Date().toISOString(),
  url,
})

const isDupl = (feeds, url) => feeds.some(feed => feed.url === url)

const form = document.querySelector('#rss-form')
const urlInput = document.querySelector('#url-input')

form.addEventListener('submit', (e) => {
  const { urlForm, feeds } = watchedState
  e.preventDefault()
  const formData = new FormData(e.target)
  const input = String(formData.get('url'))
  urlForm.errors = []
  urlValidator(input)
    .then(() => {
      if (isDupl(feeds, input)) {
        throw new Error(`RSS уже существует`)
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

render(state)
