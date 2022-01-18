import * as statusesModule from './statuses'

describe('@state/modules/statuses', () => {
  it('exports a valid Vuex module', () => {
    expect(statusesModule).toBeAVuexModule()
  })
})
