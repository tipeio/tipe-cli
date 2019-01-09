describe('push', () => {
  let results
  beforeEach(() => {
    results = []
    jest
      .spyOn(process.stdout, 'write')
      .mockImplementation(val => results.push(val))
  })

  afterEach(() => jest.restoreAllMocks())

  test('validates schema', async () => {
    console.log('test')
  })
})
