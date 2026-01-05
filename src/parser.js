const parser = (xmlFormat) => {
  const pars = new DOMParser()

  const doc = pars.parseFromString(xmlFormat, 'application/xml')
  const errorNode = doc.querySelector('parsererror')
  if (errorNode) throw new Error ('Parsing failed')
  else {
    const feedTitleEl = doc.querySelector('channel title')
    const feedDescriptionEl = doc.querySelector('channel description')
    if (!feedTitleEl || !feedDescriptionEl) throw new Error('Invalid RSS')
    const feed = {
      title: feedTitleEl.textContent,
      description: feedDescriptionEl.textContent,
    }
    const posts = [...doc.querySelectorAll('item')]
      .map((post) => {
        const postTitleEl = post.querySelector('title')
        const postLinkEl = post.querySelector('link')
        if (!postTitleEl || !postLinkEl) return null
        return {
          title: postTitleEl.textContent,
          link: postLinkEl.textContent,
        }
      })
      .filter(Boolean)
    return { feed, posts }
  }
}

export default parser
