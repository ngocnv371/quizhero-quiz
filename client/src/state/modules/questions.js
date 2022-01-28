import axios from 'axios'

export const state = {
  sort: 'id',
  order: 'asc',
  skip: 0,
  take: 20,
  search: '',
  topics: '',
  total: 0,
  items: [],
}

export const getters = {}

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
    state.items = [...state.items, item]
  },
  REMOVE_ITEM(state, item) {
    state.items = state.items.filter((i) => i.id !== item.id)
  },
}

function createParam(name, value) {
  return value ? `&${name}=${value}` : ''
}

export const actions = {
  loadQuestions(
    { commit },
    { skip, take, sort, order, query, topics, quizzes }
  ) {
    const url =
      `/api/questions?` +
      createParam('skip', skip) +
      createParam('take', take) +
      createParam('sort', sort) +
      createParam('order', order) +
      createParam('query', query) +
      createParam('topics', topics) +
      createParam('quizzes', quizzes)
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
  createQuestion({ commit }, payload) {
    const {
      quizId,
      text,
      choice0,
      choice1,
      choice2,
      choice3,
      correct0,
      correct1,
      correct2,
      correct3,
    } = payload
    return axios
      .post(`/api/quizzes/${quizId}/questions`, {
        text,
        choice0,
        choice1,
        choice2,
        choice3,
        correct0: correct0 ? 1 : 0,
        correct1: correct1 ? 1 : 0,
        correct2: correct2 ? 1 : 0,
        correct3: correct3 ? 1 : 0,
      })
      .then((response) => {
        const data = response.data
        commit('ADD_ITEM', data)
        return data
      })
  },
  updateQuestion({ commit }, payload) {
    const {
      id,
      quizId,
      text,
      choice0,
      choice1,
      choice2,
      choice3,
      correct0,
      correct1,
      correct2,
      correct3,
    } = payload
    return axios
      .put(`/api/quizzes/${quizId}/questions/${id}`, {
        text,
        choice0,
        choice1,
        choice2,
        choice3,
        correct0: correct0 ? 1 : 0,
        correct1: correct1 ? 1 : 0,
        correct2: correct2 ? 1 : 0,
        correct3: correct3 ? 1 : 0,
      })
      .then((response) => {
        const data = response.data
        commit('UPDATE_ITEM', data)
        return data
      })
  },
  deleteQuestion({ commit }, payload) {
    const { quizId, id } = payload
    return axios
      .delete(`/api/quizzes/${quizId}/questions/${id}`)
      .then((response) => {
        const data = response.data
        commit('REMOVE_ITEM', { id })
        return data
      })
  },
}
