import netRequest from './net.js'
import parser from './parser.js'
import { createPost } from './utils.js'

const autoUpdate = (watchedState) => {
  const { feeds: { byId, allIds }, posts, postsByFeedId } = watchedState

  const allFeeds = allIds.map(id => ({
    id,
    url: byId[id].url,
    feed: byId[id],
  }))
  allFeeds.forEach(({ id, url }) => {
    netRequest(url)
      .then(parser)
      .then(({ posts: newPosts }) => {
        const curLinksArr = (postsByFeedId[id] || []).map(postId => posts.byId[postId].link)
        const currFeedLinks = new Set(curLinksArr)
        const uniqPosts = newPosts.filter(post => !currFeedLinks.has(post.link))
        uniqPosts.forEach((post) => {
          const newPost = createPost(id, post.title, post.link, post.description)
          posts.byId[newPost.id] = newPost
          posts.allIds.push(newPost.id)
          postsByFeedId[id].push(newPost.id)
        })
      })
      .catch ((error) => {
        console.log(`${id}:`, error.message)
      })
  })
  setTimeout(() => autoUpdate(watchedState), 5000)
}

export default autoUpdate
