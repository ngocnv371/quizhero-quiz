import * as topicsModule from './topics'

describe('@state/modules/topics', () => {
  it('exports a valid Vuex module', () => {
    expect(topicsModule).toBeAVuexModule()
  })
})
