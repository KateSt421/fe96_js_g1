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
    expect(cartItems.textContent.trim()).toEqual('Очистить')
  })

  test('the DOM opens correctly and sees the page', () => {
    const cart = document.querySelector('.cart__item')
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
    expect(document.querySelector('.cart__item')).toBeNull()

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

    // Должен быть отображён .cart__item
    const card = document.querySelector('.cart__item')
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

  //Тренируюсь на кошках...

  //Удаление товара
  test('remove item from cart', () => {
    const cart = [
      { id: 1, name: 'Pasta', price: 100, quantity: 1 },
      { id: 2, name: 'Sauce', price: 50, quantity: 1 },
    ]
    localStorage.setItem('cart', JSON.stringify(cart))

    cartManager.removeItem(1)

    const updated = JSON.parse(localStorage.getItem('cart'))
    expect(updated.length).toBe(1)
    expect(updated[0].id).toBe(2)
  })

  //Очистка корзины
  test('clear cart removes all items', () => {
    const cart = [{ id: 1, name: 'Cheese', price: 80, quantity: 1 }]
    localStorage.setItem('cart', JSON.stringify(cart))

    cartManager.clearCart()

    const cleared = JSON.parse(localStorage.getItem('cart'))
    expect(cleared).toEqual([])
  })

  //updateQuantity удаляет товар при quantity === 0
  test('updateQuantity removes item when quantity reaches 0', () => {
    const cart = [{ id: 3, name: 'Garlic', price: 20, quantity: 1 }]
    localStorage.setItem('cart', JSON.stringify(cart))

    cartManager.updateQuantity(3, -1)

    const result = JSON.parse(localStorage.getItem('cart'))
    expect(result).toEqual([])
  })

  //getTotal() должен считать общую сумму
  test('getTotal returns correct sum', () => {
    const cart = [
      { id: 1, price: 100, quantity: 2 }, // 200
      { id: 2, price: 50, quantity: 1 }, // 50
    ]
    localStorage.setItem('cart', JSON.stringify(cart))

    const total = cartManager.getTotal()
    expect(total).toBe(250)
  })

  //При loadCart() отрисовываются элементы
  test('loadCart renders cart items in DOM', () => {
    const cart = [
      {
        id: 1,
        name: 'Фикус',
        image: 'img.jpg',
        price: 100,
        quantity: 1,
        category: 'plant',
      },
    ]
    localStorage.setItem('cart', JSON.stringify(cart))

    cartManager.loadCart()

    const cartItems = document.getElementById('cart-items')
    const nameElement = cartItems.querySelector('.cart__name')
    expect(nameElement).not.toBeNull()
    expect(nameElement.textContent).toContain('Фикус')

    expect(cartItems.querySelectorAll('.cart__item').length).toBe(1)
  })
})
