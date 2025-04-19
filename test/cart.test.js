const fs = require('fs')
const path = require('path')

describe('check whole f*ng cart', () => {
  let cartManager
  beforeAll(() => {
    //feed to DOM ours page
    const html = fs.readFileSync(
      path.resolve(__dirname, '../public/cart.html'),
      'utf8'
    )

    //take the html and set it as HTML in DOM
    document.documentElement.innerHTML = html
    cartManager = require('../public/cart')
    //check we get HTML elements and page in DOM correctly, that there is content inside
    console.log(document.body.childElementCount)
    console.log(document.body.childNodes.length)
    const cartItems = document.getElementById('clear-cart')
    expect(cartItems.textContent).toEqual('Очистить')
  })

  test('IDK', () => {
    const cart = document.querySelector('.product-card')
    expect(cart).toBeNull()

    const cartWrapper = document.querySelector('.cart__empty-wrapper')
    expect(cartWrapper).not.toBeNull()
    expect(document.title).toEqual('Cart - Flower Shop')
  })
  test('if cart`s JSON exist', () => {})
})
