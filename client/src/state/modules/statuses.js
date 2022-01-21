export const state = [
  { id: 1, name: 'Draft', color: '' },
  { id: 2, name: 'Pending', color: 'secondary' },
  { id: 3, name: 'Approved', color: 'primary' },
  { id: 4, name: 'Rejected', color: 'error' },
  { id: 5, name: 'Deleted', color: 'pink' },
]

export const getters = {
  statuses: (state) => state,
}

export const mutations = {}

export const actions = {}
