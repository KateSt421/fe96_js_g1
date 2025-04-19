/**
 * @jest-environment jsdom
 */

//example of the DOM test (to check if the DOM works)
test('use jsdom in this test file', () => {
  const element = document.createElement('div')
  expect(element).not.toBeNull()
})
