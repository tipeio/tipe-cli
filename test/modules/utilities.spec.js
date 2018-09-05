const { validateEmail } = require('../../src/utilities')

describe('validateEmail', () => {
  it('should return false if given broken email', () => {
    expect(validateEmail('')).toBeFalsy()
    expect(validateEmail('test')).toBeFalsy()
    expect(validateEmail('test@')).toBeFalsy()
    expect(validateEmail('test@test')).toBeFalsy()
  })
  it('should return true if given email', () => {
    expect(validateEmail('test+1@gmail.com')).toBeTruthy()
    expect(validateEmail('test@test.com')).toBeTruthy()
    expect(validateEmail('testing@hotmail.com')).toBeTruthy()
    expect(validateEmail('test@yahoo.com')).toBeTruthy()
  })
})
