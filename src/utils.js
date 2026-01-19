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

const handleNetError = (err, i18nInstance) => {
  switch (err.message) {
    case 'notRss':
      return i18nInstance.t('errors.notRss')
    case 'parsingFailed':
      return i18nInstance.t('errors.parsingFailed')
    case 'invalidRss':
      return i18nInstance.t('errors.invalidRss')
    default:
      return i18nInstance.t('errors.network')
  }
}

export { createFeed, createPost, handleNetError }
