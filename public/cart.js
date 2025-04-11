class CartManager {
  constructor() {
    this.loadCart()
    this.initCheckout()
  }

  loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    this.displayCart(cart)
    this.calculateTotals(cart)
  }

  displayCart(items) {
    const cartItems = document.getElementById('cart-items')
    if (items.length === 0) {
      cartItems.innerHTML = '<p>Your cart is empty</p>'
      return
    }

    cartItems.innerHTML = items
      .map(
        (item) =>
          `<div class="plant-card" data-plant-id="${item.id}">
        <img src="${item.image}" alt="${item.name}">
        <h3>${item.name}</h3>
        <p class="item-price" data-item-id="${item.id}">$${(
            item.price * item.quantity
          ).toFixed(2)}</p>
        <div class="quantity-controls">
          <button onclick="cartManager.updateQuantity(${
            item.id
          }, -1)" class="quantity-btn">-</button>
          <span>${item.quantity}</span>
          <button onclick="cartManager.updateQuantity(${
            item.id
          }, 1)" class="quantity-btn">+</button>
        </div>
      </div>
    `
      )
      .join('')
  }

  updateQuantity(itemId, change) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const item = cart.find((item) => item.id === itemId)

    if (item) {
      item.quantity = Math.max(0, item.quantity + change)
      if (item.quantity === 0) {
        cart = cart.filter((item) => item.id !== itemId)
      }
      localStorage.setItem('cart', JSON.stringify(cart))
      this.loadCart()
      this.calculateTotals(cart) // Обновляем сумму после изменения количества

      // Обновляем цену товара в карточке
      const itemPriceElement = document.querySelector(
        `.item-price[data-item-id="${itemId}"]`
      )
      if (itemPriceElement) {
        itemPriceElement.textContent = `$${(item.price * item.quantity).toFixed(
          2
        )}`
      }
    }
  }

  calculateDiscount(total) {
    return total > 100 ? total * 0.1 : 0
  }

  calculateTotals(items) {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
    const discount = this.calculateDiscount(subtotal)
    const total = subtotal - discount

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`
    document.getElementById('discount').textContent = `$${discount.toFixed(2)}`
    document.getElementById('total').textContent = `$${total.toFixed(2)}`
  }

  removeItem(itemId) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]')
    cart = cart.filter((item) => item.id !== itemId)
    localStorage.setItem('cart', JSON.stringify(cart))
    this.loadCart()
  }

  initCheckout() {
    document.getElementById('checkout-form').addEventListener('submit', (e) => {
      e.preventDefault()
      alert('Order placed successfully!')
      localStorage.removeItem('cart')
      this.loadCart()
    })
  }
}

const cartManager = new CartManager()
