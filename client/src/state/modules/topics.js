import axios from 'axios'

export const state = {
  sort: 'name',
  order: 'asc',
  skip: 0,
  take: 20,
  search: '',
  total: 0,
  items: [],
  cache: [],
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
    state.items = [...state.items, item]
  },
  REMOVE_ITEM(state, item) {
    state.items = state.items.filter((i) => i.id !== item.id)
  },
  UPDATE_CACHE(state, item) {
    const index = state.cache.findIndex((c) => c.id === item.id)
    if (index >= 0) {
      state.cache[index] = item
    } else {
      state.cache = [...state.cache, item]
    }
  },
}

function createParam(name, value) {
  return value ? `${name}=${value}` : ''
}

export const actions = {
  async loadTopics({ commit }, { skip, take, sort, order, query }) {
    const url =
      `/api/topics?` +
      [
        createParam('skip', skip),
        createParam('take', take),
        createParam('sort', sort),
        createParam('order', order),
        createParam('query', query),
      ]
        .filter(Boolean)
        .join('&')
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
  cache({ commit }, { items }) {
    items.forEach((item) => commit('UPDATE_CACHE', item))
  },
  findQuizzesByIds(context, { ids }) {
    const cached = context.state.cache.filter((c) => ids.includes(c.id))
    if (cached.length === ids.length) {
      return Promise.resolve(cached)
    }
    const notCachedIds = ids.filter((id) => !cached.some((i) => i.id === id))
    if (!notCachedIds.length) {
      return Promise.resolve(cached)
    }
    const url = `/api/topics?` + createParam('ids', notCachedIds)
    return axios.get(url).then((response) => {
      context.dispatch('cache', response.data)
      return response.data.items
    })
  },
  createTopic({ commit, dispatch }, payload) {
    const { name, topicId } = payload
    return axios
      .post(`/api/topics`, {
        name,
        topicId,
      })
      .then((response) => {
        const data = response.data
        commit('ADD_ITEM', data)
        dispatch('cache', { items: [data] })
        return data
      })
  },
  updateTopic({ commit, dispatch }, payload) {
    const { id, name, topicId } = payload
    return axios
      .put(`/api/topics/${id}`, {
        name,
        topicId,
      })
      .then((response) => {
        const data = response.data
        commit('UPDATE_ITEM', data)
        dispatch('cache', { items: [data] })
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
