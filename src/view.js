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

// модель и контроллер находятся в одном модуле, разелять нет необходитмости потому что модель в данной ситуации просто объект
// view отдельный модуль, которому передаем state! в onChange отдаем начальное состояние state, она нам отдаем объект, в котором она отслеживаем изменения и все изменения мы вносим уже в этот объект, который получили
// вотчер настраиваем именно во view. из него экспортируем одну функцию watch которую вызвали и дали начальное состояние - иди следи
// onChange не вместе с контроллером, а экспортируется и делается во view

// что храним в state? фиды, посты, форма, процесс загрузки, состояние интерфейса! фиды и посты - массивы
// для формы - ошибки и валидно/не валидно
// для процесса загрузки - статус и ошибки

// в начала у нас идет initialState

// где
