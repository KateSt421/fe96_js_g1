const details = require('../data/details')

describe('Details JSON structure', () => {
  it('should have the correct keys in each object', () => {
    const expectedKeys = ['id', 'images', 'detail_description', 'size']

    details.forEach((detail) => {
      expectedKeys.forEach((key) => {
        expect(detail).toHaveProperty(key)
      })
    })
  })
})
