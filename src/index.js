import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import init from './init.js'
import app from './app.js'

init()
  .then(({ i18nInstance, state }) => {
    app({ i18nInstance, state })
  })
  .catch((error) => {
    console.error('Ошибка инициализации', error)
  })
