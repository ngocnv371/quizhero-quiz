import * as questionsModule from './questions'

describe('@state/modules/questions', () => {
  it('exports a valid Vuex module', () => {
    expect(questionsModule).toBeAVuexModule()
  })
})
