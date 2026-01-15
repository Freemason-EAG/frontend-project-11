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

export { createFeed, createPost }
