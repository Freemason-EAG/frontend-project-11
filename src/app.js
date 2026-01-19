import { renderForm, renderFeeds, renderPosts, renderModal } from './view.js'
import urlValidator from './validator.js'
import onChange from 'on-change'
import netRequest from './net.js'
import parser from './parser.js'
import { createFeed, createPost, handleNetError } from './utils.js'
import autoUpdate from './update.js'

const handlerForm = (watchedState, i18nInstance, input) => {
  const { urlForm, feeds, posts, uiState, modal, postsByFeedId } = watchedState
  uiState.networkProcess = 'filling'
  urlForm.errors = []
  uiState.networkErrors = []

  const arrUrls = Object.values(feeds.byId).map(feed => feed.url)
  urlValidator(input, arrUrls, i18nInstance)
    .then(() => {
      uiState.networkProcess = 'sending'
      return netRequest(input)
        .then((xml) => {
          const parsedXml = parser(xml)
          const { feed, posts: parsedPosts } = parsedXml
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
          modal.isOpen = false
          modal.readPost = null
          uiState.networkErrors = []
        })
        .catch((error) => {
          uiState.networkProcess = 'failed'
          uiState.networkErrors = [handleNetError(error, i18nInstance)]
        })
    })
    .catch ((e) => {
      urlForm.errors = [e.message]
      urlForm.valid = false
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

  const watchedState = onChange(state, (path) => {
    if (path.startsWith('urlForm')
      || path === 'uiState.networkProcess'
      || path === 'uiState.networkErrors') {
      renderForm(state, i18nInstance, elements)
      return
    }
    else if (path.startsWith('feeds')) {
      renderFeeds(state.feeds, elements)
      return
    }
    else if (path.startsWith('posts')
      || path.startsWith('uiState.readPostsIds')) {
      renderPosts(state.posts, state.uiState.readPostsIds, elements)
      return
    }
    else if (path.startsWith('modal')) {
      renderModal(state, elements)
      return
    }
  })

  autoUpdate(watchedState, i18nInstance)

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const input = formData.get('url').trim()
    handlerForm(watchedState, i18nInstance, input, elements)
  })

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
}

export default app

// if (elements.modalElement) {
//   elements.modalElement.addEventListener('hidden.bs.modal', () => {
//     watchedState.modal.isOpen = false
//     watchedState.modal.readPost = null
//   })
// }
