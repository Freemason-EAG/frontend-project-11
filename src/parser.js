const parser = (xmlFormat) => {
  if (!xmlFormat.startsWith('<?xml') && !xmlFormat.includes('<rss')) {
    throw new Error('notRss')
  }
  const pars = new DOMParser()

  const doc = pars.parseFromString(xmlFormat, 'application/xml')
  const errorNode = doc.querySelector('parsererror')
  if (errorNode) throw new Error ('ParsingFailed')
  else {
    const feedTitleEl = doc.querySelector('channel title')
    const feedDescriptionEl = doc.querySelector('channel description')
    if (!feedTitleEl || !feedDescriptionEl) throw new Error('InvalidRss')
    const feed = {
      title: feedTitleEl.textContent,
      description: feedDescriptionEl.textContent,
    }
    const posts = [...doc.querySelectorAll('item')]
      .map((post) => {
        const postTitleEl = post.querySelector('title')
        const postLinkEl = post.querySelector('link')
        const postDescriptionEl = post.querySelector('description')
        if (!postTitleEl || !postLinkEl) return null
        return {
          title: postTitleEl.textContent,
          link: postLinkEl.textContent,
          description: postDescriptionEl?.textContent || '',
        }
      })
      .filter(Boolean)
    return { feed, posts }
  }
}

export default parser
