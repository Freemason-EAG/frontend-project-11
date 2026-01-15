import render from './view.js'
import urlValidator from './validator.js'
import onChange from 'on-change'
import netRequest from './net.js'
import parser from './parser.js'
import { createFeed, createPost } from './utils.js'
import autoUpdate from './update.js'

const handlerForm = (watchedState, i18nInstance, input, { urlInput }) => {
  const { urlForm, feeds, posts, uiState, postsByFeedId } = watchedState
  uiState.networkProcess = 'filling'
  urlForm.errors = []
  uiState.networkErrors = []

  const arrUrls = Object.values(feeds.byId).map(feed => feed.url)
  urlValidator(input, arrUrls, i18nInstance)
    .then(() => {
      uiState.networkProcess = 'sending'
      netRequest(input, i18nInstance)
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
          uiState.networkErrors = [error.message]
          urlInput.focus()
        })
    })
    .catch ((e) => {
      urlForm.errors = [e.message]
      urlForm.valid = false
      urlInput.focus()
    })
}

const app = ({ i18nInstance, state }) => {
  const elements = {
    form: document.querySelector('#rss-form'),
    urlInput: document.querySelector('#url-input'),
    postsContainer: document.querySelector('#posts-container'),
    modalElement: document.querySelector('#modal-window'),

    feedback: document.querySelector('.feedback'),
    feedsContainer: document.querySelector('#feeds-container'),
    submitButton: document.querySelector('button[type="submit"]'),
    modalTitle: document.querySelector('#modal-title'),
    modalDescription: document.querySelector('#modal-description'),
    modalLink: document.querySelector('#modal-link'),
  }

  const watchedState = onChange(state, () => {
    render(state, i18nInstance, elements)
  })
  autoUpdate(watchedState, i18nInstance)

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const urlValue = formData.get('url')
    const input = (typeof urlValue === 'string' ? urlValue : '').trim()
    handlerForm(watchedState, i18nInstance, input, elements)
  })
  render(watchedState, i18nInstance, elements)

  elements.postsContainer.addEventListener('click', (event) => {
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
    }
  })
  if (elements.modalElement) {
    elements.modalElement.addEventListener('hidden.bs.modal', () => {
      watchedState.modal.isOpen = false
      watchedState.modal.readPost = null
    })
  }
}

export default app
