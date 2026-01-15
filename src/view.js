import { Modal } from 'bootstrap'

const render = (state, i18nInstance, elements) => {
  const { urlInput, feedback, submitButton } = elements
  const { urlForm, uiState } = state

  urlInput.classList.remove('is-valid', 'is-invalid')
  feedback.classList.remove('text-success', 'text-danger')
  // feedback.textContent = ''

  if (uiState.networkProcess === 'sending') {
    submitButton.disabled = true
    // feedback.classList.remove('text-success', 'text-danger')
    feedback.textContent = i18nInstance.t('form.loading')
  }

  else if (uiState.networkProcess === 'finished' && urlForm.valid) {
    submitButton.disabled = false
    urlInput.classList.add('is-valid')
    // feedback.classList.remove('text-danger')
    feedback.classList.add('text-success')
    feedback.textContent = i18nInstance.t('success.rssLoaded')
  }

  else if (uiState.networkProcess === 'failed' && uiState.networkErrors.length > 0) {
    submitButton.disabled = false
    urlInput.classList.add('is-invalid')
    feedback.classList.add('text-danger')
    feedback.textContent = uiState.networkErrors[0]
  }

  else if (urlForm.errors.length > 0 && !urlForm.valid) {
    submitButton.disabled = false
    urlInput.classList.add('is-invalid')
    feedback.classList.add('text-danger')
    feedback.textContent = urlForm.errors[0]
  }
  else {
    submitButton.disabled = false
  }

  renderFeeds(state.feeds, elements)
  renderPosts(state.posts, state.uiState.readPostsIds, elements)
  renderModal(state, elements)
}

export default render

const renderFeeds = ({ byId, allIds }, { feedsContainer }) => {
  const feedsArray = [...allIds].reverse().map(id => byId[id]) // делаем копию allIds, переворачиваем его, проходимся по его id и получаем массив элементов byId c id из allIds в указанном порядке
  if (feedsArray.length === 0) {
    feedsContainer.innerHTML = ''
    return
  }
  const items = feedsArray.map(({ title, description }) => `
    <li class="list-group-item border-0 border-end-0">
      <h3 class="h6 m-0">${title}</h3>
      <p class="m-0 small text-black-50">${description}</p>
    </li>`).join('')
  feedsContainer.innerHTML = `
      <div class="card border-0">
      <div class="card-body">
      <h2 class="card-title h4">Фиды</h2>
      </div>
      <ul class="list-group border-0 rounded-0">
      ${items}
      </ul>
      </div>`
}

const renderPosts = ({ byId, allIds }, readPostsIds, { postsContainer }) => {
  const postsArray = [...allIds].reverse().map(id => byId[id]) // делаем копию allIds, переворачиваем его, проходимся по его id и получаем массив элементов byId c id из allIds в указанном порядке
  if (postsArray.length === 0) {
    postsContainer.innerHTML = ''
    return
  }
  const items = postsArray.map(({ id, title, link }) => {
    const isRead = readPostsIds.includes(id)
    const fontStyle = isRead ? 'fw-normal' : 'fw-bold'
    return `
    <li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0">
      <a href="${link}" class="${fontStyle}" target="_blank" rel="noopener noreferrer">${title}</a>
      <button type="button" data-id="${id}" class="btn btn-outline-primary btn-sm">
        Просмотр
      </button>
    </li>`
  }).join('')
  postsContainer.innerHTML = `
   <div class="card border-0">
    <div class="card-body">
    <h2 class="card-title h4">Посты</h2>
    </div>
      <ul class="list-group border-0 rounded-0">
      ${items}
      </ul>
    </div>`
}

const renderModal = (state, { modalElement, modalTitle, modalDescription, modalLink }) => {
  const { modal } = state
  const { isOpen, readPost } = modal

  if (!isOpen || !readPost) return

  if (modalElement.classList.contains('show')) return

  const { postTitle, postDescription, postLink } = readPost

  modalTitle.textContent = postTitle
  modalDescription.textContent = postDescription
  modalLink.setAttribute('href', postLink)

  let modalInstance = Modal.getInstance(modalElement)
  if (!modalInstance) modalInstance = new Modal(modalElement)

  modalInstance.show()
}

// http://feeds.bbci.co.uk/news/rss.xml
// https://www.nasa.gov/rss/dyn/breaking_news.rss
// https://www.theguardian.com/world/rss
// https://lorem-rss.hexlet.app/feed?unit=second&length=2
