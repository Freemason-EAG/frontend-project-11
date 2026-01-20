import { Modal } from 'bootstrap'

const renderForm = (state, i18nInstance, elements) => {
  const { urlInput, feedback, submitButton } = elements
  const { urlForm, uiState } = state

  urlInput.classList.remove('is-valid', 'is-invalid')
  feedback.classList.remove('text-success', 'text-danger')

  if (uiState.networkProcess === 'sending') {
    submitButton.disabled = true
    feedback.textContent = i18nInstance.t('form.loading')
  }

  else if (uiState.networkProcess === 'finished' && urlForm.valid) {
    submitButton.disabled = false
    urlInput.classList.add('is-valid')
    feedback.classList.add('text-success')
    feedback.textContent = i18nInstance.t('success.rssLoaded')

    urlInput.value = ''
    urlInput.focus()
  }

  else if (uiState.networkProcess === 'failed' && uiState.networkErrors.length > 0) {
    submitButton.disabled = false
    urlInput.classList.add('is-invalid')
    feedback.classList.add('text-danger')
    feedback.textContent = uiState.networkErrors[0]

    urlInput.focus()
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
}

const renderFeeds = ({ byId, allIds }, { feedsContainer }) => {
  const feedsArray = [...allIds].reverse().map(id => byId[id])
  if (feedsArray.length === 0) {
    feedsContainer.innerHTML = ''
    return
  }
  const items = feedsArray.map(({ title, description }) => {
    const li = document.createElement('li')
    li.classList.add('list-group-item', 'border-0', 'border-end-0')

    const h3 = document.createElement('h3')
    h3.classList.add('h6', 'm-0')
    h3.textContent = title

    const p = document.createElement('p')
    p.classList.add('m-0', 'small', 'text-black-50')
    p.textContent = description

    li.appendChild(h3)
    li.appendChild(p)
    return li
  })

  const card = document.createElement('div')
  card.classList.add('card', 'border-0')

  const cardBody = document.createElement('div')
  cardBody.classList.add('card-body')

  const cardTitle = document.createElement('h2')
  cardTitle.classList.add('card-title', 'h4')
  cardTitle.textContent = 'Фиды'

  cardBody.appendChild(cardTitle)

  const listGroup = document.createElement('ul')
  listGroup.classList.add('list-group', 'border-0', 'rounded-0')
  items.forEach(item => listGroup.appendChild(item))

  card.appendChild(cardBody)
  card.appendChild(listGroup)

  feedsContainer.innerHTML = ''
  feedsContainer.appendChild(card)
}

const renderPosts = ({ byId, allIds }, readPostsIds, { postsContainer }) => {
  const postsArray = [...allIds].reverse().map(id => byId[id])
  if (postsArray.length === 0) {
    postsContainer.innerHTML = ''
    return
  }
  const items = postsArray.map(({ id, title, link }) => {
    const isRead = readPostsIds.includes(id)
    const fontStyle = isRead ? 'fw-normal' : 'fw-bold'

    const li = document.createElement('li')
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0')

    const a = document.createElement('a')
    a.classList.add(`${fontStyle}`)
    a.setAttribute('href', `${link}`)
    a.setAttribute('target', '_blank')
    a.setAttribute('rel', 'noopener noreferrer')
    a.textContent = `${title}`

    const button = document.createElement('button')
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm')
    button.type = 'button'
    button.dataset.id = id
    button.textContent = 'Просмотр'

    li.appendChild(a)
    li.appendChild(button)
    return li
  })
  const card = document.createElement('div')
  card.classList.add('card', 'border-0')

  const cardBody = document.createElement('div')
  cardBody.classList.add('card-body')

  const cardTitle = document.createElement('h2')
  cardTitle.classList.add('card-title', 'h4')
  cardTitle.textContent = 'Посты'

  const listGroup = document.createElement('ul')
  listGroup.classList.add('list-group', 'border-0', 'rounded-0')

  items.forEach(item => listGroup.appendChild(item))
  cardBody.appendChild(cardTitle)
  card.appendChild(cardBody)
  card.appendChild(listGroup)

  postsContainer.innerHTML = ''
  postsContainer.appendChild(card)
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

export { renderForm, renderFeeds, renderPosts, renderModal }

// http://feeds.bbci.co.uk/news/rss.xml
// https://www.nasa.gov/rss/dyn/breaking_news.rss
// https://www.theguardian.com/world/rss
// https://lorem-rss.hexlet.app/feed?unit=second&length=2
// https://lorem-rss.hexlet.app/not-rss - невалидный
