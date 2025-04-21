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

  test('the DOM opens correctly and sees the page', () => {
    const cart = document.querySelector('.product-card')
    expect(cart).toBeNull()

    const cartWrapper = document.querySelector('.cart__empty-wrapper')
    expect(cartWrapper).not.toBeNull()
    expect(document.title).toEqual('Cart - Flower Shop')
  })
  test('check in localStorage if the CART JSON exist', () => {
    // if there is no cart JSON it should return null
    const raw = localStorage.getItem('cart')
    expect(raw).toBeNull()

    // parse json. If even if the cart is onot exist we shouldn't fall into error state and need to have empty array []
    const parsed = JSON.parse(raw || '[]')
    expect(Array.isArray(parsed)).toBe(true)
    expect(parsed).toEqual([])
  })
  test('No goodies in the cart', () => {
    // Убедимся, что localStorage пуст
    localStorage.clear()

    // Запускаем логику loadCart
    cartManager.loadCart()

    // В DOM не должно быть карточек товара
    expect(document.querySelector('.product-card')).toBeNull()

    // Должен отображаться empty‑state
    const emptyText = document.querySelector('.cart__empty-text')
    expect(emptyText).not.toBeNull()
    expect(emptyText.textContent).toBe('Все еще не выбрали зеленого друга?')
  })
  test('cart is not empty', () => {
    const fakeCart = [
      { id: 42, name: 'TestPlant', image: 'img.jpg', price: 100, quantity: 2 },
    ]
    localStorage.setItem('cart', JSON.stringify(fakeCart))
    cartManager.loadCart()

    // Должен быть отображён .product-card
    const card = document.querySelector('.product-card')
    expect(card).not.toBeNull()
    expect(card.getAttribute('data-plant-id')).toBe('42')

    // Empty-state должен исчезнуть
    expect(document.querySelector('.cart__empty-text')).toBeNull()

    // Все служебные секции должны быть видимы
    expect(
      getComputedStyle(document.getElementById('clear-cart')).display
    ).not.toBe('none')
    expect(
      getComputedStyle(document.getElementById('cart-promo')).display
    ).not.toBe('none')
    expect(
      getComputedStyle(document.getElementById('subtotal')).display
    ).not.toBe('none')
    expect(getComputedStyle(document.getElementById('total')).display).not.toBe(
      'none'
    )
    expect(
      getComputedStyle(document.getElementById('checkout-form')).display
    ).not.toBe('none')
  })
})
