import * as quizzesModule from './quizzes'

describe('@state/modules/quizzes', () => {
  it('exports a valid Vuex module', () => {
    expect(quizzesModule).toBeAVuexModule()
  })
})
