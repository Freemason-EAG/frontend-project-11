const createFeed = (url, title, description) => ({
  id: crypto.randomUUID(),
  url,
  title,
  description,

})

const createPost = (feedId, title, link, description) => ({
  id: crypto.randomUUID(),
  feedId,
  title,
  link,
  description,
})

const isDupl = (feeds, url) => {
  const allValues = Object.values(feeds.byId)
  return allValues.some(feed => feed.url === url)
}

export { createFeed, createPost, isDupl }
