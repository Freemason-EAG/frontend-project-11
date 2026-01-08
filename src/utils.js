const createFeed = (url, title, description) => ({
  id: crypto.randomUUID(),
  url,
  title,
  description,

})

const createPost = (feedId, title, link) => ({
  id: crypto.randomUUID(),
  feedId,
  title,
  link,
})

const isDupl = (feeds, url) => {
  const allValues = Object.values(feeds.byId)
  return allValues.some(feed => feed.url === url)
}

export { createFeed, createPost, isDupl }
