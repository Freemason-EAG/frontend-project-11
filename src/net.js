import axios from 'axios'

const netRequest = (url) => {
  const allOriginsUrl = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(`${url}`)}`

  return axios.get(allOriginsUrl)
    .then((response) => {
      if (response.data.status.http_code === 200) {
        console.log(response.data.contents)
        return response.data.contents
      }
      throw new Error('Network response was not ok.')
    })
    .catch ((error) => {
      throw new Error(`Network error: ${error.message}`)
    })
}

export default netRequest
