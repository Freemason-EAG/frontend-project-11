export default {
  translation: {
    header: {
      title: 'RSS агрегатор',
      subtitle: 'Читай все свои RSS-каналы в одном месте.',
    },
    form: {
      label: 'Ссылка RSS',
      placeholder: 'Ссылка RSS',
      button: 'Добавить',
      example: 'Пример: https://lorem-rss.hexlet.app/feed',
      loading: 'Загрузка...',
    },
    sections: {
      posts: 'Посты',
    },
    errors: {
      required: 'Не должно быть пустым',
      url: 'Ссылка должна быть валидным URL',
      duplicate: 'RSS уже существует',
      network: 'Ошибка сети',
      notRss: 'Ресурс не содержит валидный RSS',
    },
    success: {
      rssLoaded: 'RSS успешно загружен',
    },
  },
}
