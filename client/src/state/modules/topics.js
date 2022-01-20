import axios from 'axios'

export const state = {
  items: [],
}

export const getters = {
  topics: (state) => state.items,
}

export const mutations = {
  SET_ITEMS(state, items) {
    state.items = items
  },
}

function createParam(name, value) {
  return value ? `&${name}=${value}` : ''
}

export const actions = {
  init({ dispatch }) {
    dispatch('loadTopics')
  },
  async loadTopics({ commit }) {
    const url = `/topics?` + createParam('skip', 0) + createParam('take', 100)
    return axios.get(url).then((response) => {
      const data = response.data
      commit('SET_ITEMS', data.items)
      return data
    })
  },
}
