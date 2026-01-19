const netRequest = (url) => {
  const allOriginsUrl = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`

  return fetch(allOriginsUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network error: ${response.status}`)
      }
      return response.json()
    })
    .then(data => data.contents)
}

export default netRequest
