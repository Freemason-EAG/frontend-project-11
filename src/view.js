const render = (state, i18nInstance) => {
  const { urlForm } = state
  const urlInput = document.querySelector('#url-input')
  const feedback = document.querySelector('.feedback')

  urlInput.classList.remove('is-valid', 'is-invalid')
  feedback.classList.remove('text-success', 'text-danger')
  feedback.textContent = ''

  if (urlForm.errors.length > 0 && !urlForm.valid) {
    urlInput.classList.add('is-invalid')
    feedback.classList.add('text-danger')
    feedback.textContent = urlForm.errors[0]
  }
  else if (urlForm.errors.length === 0 && urlForm.valid) {
    urlInput.classList.add('is-valid')
    feedback.classList.add('text-success')
    feedback.textContent = i18nInstance.t('success.rssLoaded')
  }
}

export default render
