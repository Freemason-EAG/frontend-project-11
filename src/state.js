const state = {
  urlForm: {
    valid: false,
    errors: [],
  },
  feeds: [],
  posts: {},
  uiState: {
    networkProcess: 'filling', // 'sending', 'finished', 'failed'
    networkErrors: [],
  },
}

export default state
