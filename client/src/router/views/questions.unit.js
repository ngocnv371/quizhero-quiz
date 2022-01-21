import Questions from './questions'

describe('@views/questions', () => {
  it('is a valid view', () => {
    expect(Questions).toBeAViewComponent()
  })
})
