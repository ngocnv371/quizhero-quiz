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
}

export const mutations = {
  SET_SORT(state, sort) {
    state.sort = sort;
  },
  SET_ORDER(state, order) {
    state.order = order;
  },
  SET_SKIP(state, skip) {
    state.skip = skip;
  },
  SET_TAKE(state, take) {
    state.take = take;
  },
  SET_SEARCH(state, search) {
    state.search = search;
  },
  SET_TOPICS(state, topics) {
    state.topics = topics;
  },
  SET_TOTAL(state, total) {
    state.total = total;
  },
  SET_ITEMS(state, items) {
    state.items = items;
  },
}

export const actions = {
  loadQuizzes({ commit }) {
    return axios.get('/quizzes').then((response) => {
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
}
