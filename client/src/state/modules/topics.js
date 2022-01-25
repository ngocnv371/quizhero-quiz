import axios from 'axios'

export const state = {
  sort: 'name',
  order: 'asc',
  skip: 0,
  take: 20,
  search: '',
  total: 0,
  items: [],
}

export const getters = {
  items: (state) => state.items,
}

export const mutations = {
  SET_SORT(state, sort) {
    state.sort = sort
  },
  SET_ORDER(state, order) {
    state.order = order
  },
  SET_SKIP(state, skip) {
    state.skip = skip
  },
  SET_TAKE(state, take) {
    state.take = take
  },
  SET_SEARCH(state, search) {
    state.search = search
  },
  SET_TOTAL(state, total) {
    state.total = total
  },
  SET_ITEMS(state, items) {
    state.items = items
  },
  UPDATE_ITEM(state, item) {
    state.items = state.items.map((i) => (i.id === item.id ? item : i))
  },
  ADD_ITEM(state, item) {
    state.items.push(item)
  },
  REMOVE_ITEM(state, item) {
    state.items = state.items.filter((i) => i.id !== item.id)
  },
}

function createParam(name, value) {
  return value ? `&${name}=${value}` : ''
}

export const actions = {
  async loadTopics({ commit }, { skip, take, sort, order, query }) {
    const url =
      `/api/topics?` +
      createParam('skip', skip) +
      createParam('take', take) +
      createParam('sort', sort) +
      createParam('order', order) +
      createParam('query', query)
    return axios.get(url).then((response) => {
      const data = response.data
      commit('SET_SORT', data.sort)
      commit('SET_ORDER', data.order)
      commit('SET_SKIP', data.skip)
      commit('SET_TAKE', data.take)
      commit('SET_SEARCH', data.search)
      commit('SET_TOTAL', data.total)
      commit('SET_ITEMS', data.items)
      return data
    })
  },
  findTopicsByIds(context, { ids }) {
    const url = `/api/topics?` + createParam('ids', ids)
    return axios.get(url).then((response) => {
      return response.data
    })
  },
  createTopic({ commit }, payload) {
    const { name, topicId } = payload
    return axios
      .post(`/api/topics`, {
        name,
        topicId,
      })
      .then((response) => {
        const data = response.data
        commit('ADD_ITEM', data)
        return data
      })
  },
  updateTopic({ commit }, payload) {
    const { id, name, topicId } = payload
    return axios
      .put(`/api/topics/${id}`, {
        name,
        topicId,
      })
      .then((response) => {
        const data = response.data
        commit('UPDATE_ITEM', data)
        return data
      })
  },
  deleteTopic({ commit }, payload) {
    const { id } = payload
    return axios.delete(`/api/topics/${id}`).then((response) => {
      const data = response.data
      commit('REMOVE_ITEM', payload)
      return data
    })
  },
}
