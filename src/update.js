import netRequest from './net.js'
import parser from './parser.js'
import { createPost } from './utils.js'

const autoUpdate = (watchedState, i18nInstance) => {
  const { feeds: { byId, allIds }, posts, postsByFeedId } = watchedState

  const allFeeds = allIds.map(id => ({
    id,
    url: byId[id].url,
    feed: byId[id],
  }))
  const promisesFeeds = allFeeds.map(({ id, url }) => {
    return netRequest(url)
      .then((xml) => {
        const parsedXml = parser(xml)
        const { posts: newPosts } = parsedXml
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
  Promise.all(promisesFeeds)
    .finally(() => {
      setTimeout(() => autoUpdate(watchedState, i18nInstance), 5000)
    })
}

export default autoUpdate
