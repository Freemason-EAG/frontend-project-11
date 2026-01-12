const netRequest = (url) => {
  const allOriginsUrl = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`

  return fetch(allOriginsUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`${response.status}`)
      }
      return response.json()
    })
    .then((data) => {
      if (data.status.http_code === 200) {
        return data.contents
      }
      throw new Error('Network response was not ok.')
    })
    .catch ((error) => {
      throw new Error(`Network error: ${error.message}`)
    })
}

export default netRequest

// import axios from 'axios'

// const netRequest = (url) => {
//   const allOriginsUrl = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`

//   return axios.get(allOriginsUrl)
//     .then((response) => {
//       if (response.data.status.http_code === 200) {
//         return response.data.contents
//       }
//       throw new Error('Network response was not ok.')
//     })
//     .catch ((error) => {
//       throw new Error(`Network error: ${error.message}`)
//     })
// }

// export default netRequest
