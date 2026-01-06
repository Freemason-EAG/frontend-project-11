const render = (state, i18nInstance) => {
  const { urlForm, uiState } = state
  const urlInput = document.querySelector('#url-input')
  const feedback = document.querySelector('.feedback')
  const submitButton = document.querySelector('button[type="submit"]')

  urlInput.classList.remove('is-valid', 'is-invalid')
  feedback.classList.remove('text-success', 'text-danger')
  feedback.textContent = ''

  if (uiState.networkProcess === 'sending') {
    submitButton.disabled = true
    feedback.textContent = i18nInstance.t('form.loading')
  }

  else if (uiState.networkProcess === 'finished' && urlForm.valid) {
    submitButton.disabled = false
    urlInput.classList.add('is-valid')
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

  renderFeeds(state.feeds)
  renderPosts(state.posts)
}

export default render

const renderFeeds = (feeds) => {
  const feedsContainer = document.querySelector('#feeds-container')
  if (feeds.length === 0) {
    feedsContainer.innerHTML = ''
    return
  }
  const items = feeds.map(({ title, description }) => `
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

const renderPosts = (posts) => {
  const postsContainer = document.querySelector('#posts-container')
  if (posts.length === 0) {
    postsContainer.innerHTML = ''
    return
  }
  const items = posts.map(({ title, link }) => `
    <li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0">
      <a href="${link}" class="fw-bold">${title}</a>
      <button type="button" class="btn btn-outline-primary btn-sm">
        Просмотр
      </button>
    </li>`).join('')
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

// http://feeds.bbci.co.uk/news/rss.xml
