import './style.css'
import 'bootstrap'

const button = document.querySelector('button')
button.addEventListener('click', (e) => {
  button.textContent = 'Hello'
})
