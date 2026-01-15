import netRequest from './net.js'
import parser from './parser.js'
import { createPost } from './utils.js'

const autoUpdate = (watchedState, i18nInstance) => {
  const { feeds: { byId, allIds }, posts, postsByFeedId } = watchedState

  const allFeeds = allIds.map(id => ({ // берем все id фидов, для каждого id делаем объект { id, url, feed } и получаем массив фидов
    id,
    url: byId[id].url,
    feed: byId[id],
  }))
  const promisesFeeds = allFeeds.map(({ id, url }) => {
    return netRequest(url, i18nInstance) // return чтобы потом передать в Promise.all
      .then(parser)
      .then(({ posts: newPosts }) => { // берем новые посты
        const curLinksArr = (postsByFeedId[id] || []).map(postId => posts.byId[postId].link) // берем массив id постов, которые уже есть у фида и берем оттуда link. Если у фида нет постов - [], чтобы не было undefined
        const currFeedLinks = new Set(curLinksArr) // массив всех link постов, кот у нас есть для фида превращаем в Set
        const uniqPosts = newPosts.filter(post => !currFeedLinks.has(post.link)) // фильтруем чтобы получить уникальные
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
  Promise.all(promisesFeeds) // ждем все промисы
    .finally(() => {
      setTimeout(() => autoUpdate(watchedState, i18nInstance), 5000)
    })
}

export default autoUpdate
