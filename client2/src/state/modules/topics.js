export const state = [
  { id: 1, name: 'topic 1' },
  { id: 2, name: 'topic 2' },
  { id: 3, name: 'topic 3' },
  { id: 4, name: 'topic 4' },
  { id: 5, name: 'topic 5' },
  { id: 6, name: 'topic 6' },
  { id: 7, name: 'topic 7' },
]

export const getters = {
  topics: (state) => state,
  getTopicById: (id) => state.find((i) => i.id === id),
}

export const mutations = {}

export const actions = {}
