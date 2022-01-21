import axios from 'axios'

export const state = {
  sort: 'name',
  order: 'asc',
  skip: 0,
  take: 20,
  search: '',
  topics: '',
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
  SET_TOPICS(state, topics) {
    state.topics = topics
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
  async loadQuizzes(
    { commit },
    { skip, take, sort, order, query, topics, statuses }
  ) {
    const url =
      `/quizzes?` +
      createParam('skip', skip) +
      createParam('take', take) +
      createParam('sort', sort) +
      createParam('order', order) +
      createParam('query', query) +
      createParam('topics', topics) +
      createParam('statuses', statuses)
    return axios.get(url).then((response) => {
      const data = response.data
      commit('SET_SORT', data.sort)
      commit('SET_ORDER', data.order)
      commit('SET_SKIP', data.skip)
      commit('SET_TAKE', data.take)
      commit('SET_SEARCH', data.search)
      commit('SET_TOPICS', data.topics)
      commit('SET_TOTAL', data.total)
      commit('SET_ITEMS', data.items)
      return data
    })
  },
  findQuizzesByIds(context, { ids }) {
    const url = `/quizzes?` + createParam('ids', ids)
    return axios.get(url).then((response) => {
      return response.data
    })
  },
  createQuiz({ commit }, payload) {
    const { name, topicId } = payload
    return axios
      .post(`/quizzes`, {
        name,
        topicId,
      })
      .then((response) => {
        const data = response.data
        commit('ADD_ITEM', data)
        return data
      })
  },
  updateQuiz({ commit }, payload) {
    const { id, name, topicId } = payload
    return axios
      .put(`/quizzes/${id}`, {
        name,
        topicId,
      })
      .then((response) => {
        const data = response.data
        commit('UPDATE_ITEM', data)
        return data
      })
  },
  deleteQuiz({ commit }, payload) {
    const { id } = payload
    return axios.delete(`/quizzes/${id}`).then((response) => {
      const data = response.data
      commit('UPDATE_ITEM', { ...payload, statusId: 5 })
      return data
    })
  },
}