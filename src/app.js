import render from './view.js'
import urlValidator from './validator.js'
import onChange from 'on-change'
import netRequest from './net.js'
import parser from './parser.js'
import { createFeed, createPost, isDupl } from './utils.js'
import autoUpdate from './update.js'

const updateTextlang = (i18n) => {
  document.querySelector('h1').textContent = i18n.t('header.title')
  document.querySelector('header p').textContent = i18n.t('header.subtitle')
  document.querySelector('label[for="url-input"]').textContent = i18n.t('form.label')
  document.querySelector('button[type="submit"]').textContent = i18n.t('form.button')
  document.querySelector('small code').textContent = i18n.t('form.example')
  document.querySelector('#url-input').placeholder = i18n.t('form.placeholder')
}

const handlerForm = (watchedState, i18nInstance, input) => {
  const { urlForm, feeds, posts, uiState, postsByFeedId } = watchedState
  const urlInput = document.querySelector('#url-input')
  urlForm.errors = []
  uiState.networkErrors = []

  urlValidator(input)
    .then(() => {
      if (isDupl(feeds, input)) {
        throw new Error(i18nInstance.t('errors.duplicate'))
      }
      else {
        uiState.networkProcess = 'sending'
        netRequest(input)
          .then(parser)
          .then(({ feed, posts: parsedPosts }) => {
            const newFeed = createFeed(input, feed.title, feed.description)
            const newPosts = parsedPosts.map(post => createPost(newFeed.id, post.title, post.link, post.description))
            feeds.byId[newFeed.id] = newFeed
            feeds.allIds.push(newFeed.id)
            newPosts.forEach((post) => {
              posts.byId[post.id] = post
              posts.allIds.push(post.id)
            })
            postsByFeedId[newFeed.id] = newPosts.map(post => post.id)

            urlForm.valid = true
            urlForm.errors = []
            uiState.networkProcess = 'finished'
            uiState.networkErrors = []

            urlInput.value = ''
            urlInput.focus()
          })
          .catch((error) => {
            uiState.networkProcess = 'failed'
            uiState.networkErrors = [i18nInstance.t('errors.network')]
            urlInput.focus()
          })
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
  autoUpdate(watchedState)

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const input = String(formData.get('url')).trim()
    handlerForm(watchedState, i18nInstance, input)
  })
  render(watchedState, i18nInstance)

  const postsContainer = document.querySelector('#posts-container')
  postsContainer.addEventListener('click', (event) => {
    const button = event.target.closest('.btn-outline-primary')
    const { posts } = watchedState
    if (button) {
      const postId = button.dataset.id
      const post = posts.byId[postId]
      if (!post) return
      watchedState.modal = {
        isOpen: true,
        readPost: {
          id: postId,
          postTitle: post.title,
          postDescription: post.description,
          postLink: post.link,
        },
      }
      watchedState.uiState.readPostsIds.push(postId)
      console.log(watchedState.uiState.readPostsIds)
    }
  
  })
  const modalElement = document.querySelector('#modal-window')
  if (modalElement) {
    modalElement.addEventListener('hidden.bs.modal', () => {
      watchedState.modal.isOpen = false
      watchedState.modal.readPost = null
    })
  }
}

export default app
