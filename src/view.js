const render = ({ urlForm }) => {
  const urlInput = document.querySelector('#url-input')
  const feedback = document.querySelector('.feedback')

  urlInput.classList.remove('is-valid', 'is-invalid')
  feedback.classList.remove('text-success', 'text-danger')
  feedback.textContent = ''

  if (urlForm.errors.length > 0 && urlForm.valid === false) {
    urlInput.classList.add('is-invalid')
    feedback.classList.add('text-danger')
    feedback.textContent = urlForm.errors[0]
  }
  else if (urlForm.errors.length === 0 && urlForm.valid === true) {
    urlInput.classList.add('is-valid')
    feedback.classList.add('text-success')
    feedback.textContent = 'RSS uploaded successfully'
  }
}

export default render
