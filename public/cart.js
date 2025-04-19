class CartManager {
  constructor() {
    this.loadCart()
    this.initCheckout()

    const clearBtn = document.getElementById('clear-cart')
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        localStorage.setItem('cart', '[]')
        this.loadCart()
      })
    }
  }

  loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')

    const promoWrapper = document.getElementById('cart-promo')
    const clearBtn = document.getElementById('clear-cart')
    const totalSection = document.getElementById('cart-total')
    const emptyText = document.getElementById('checkout-form')
    const subtotalSection = document.getElementById('cart-subtotal')

    if (cart.length === 0) {
      if (promoWrapper) promoWrapper.style.display = 'none'
      if (clearBtn) clearBtn.style.display = 'none'
      if (totalSection) totalSection.style.display = 'none'
      if (subtotalSection) subtotalSection.style.display = 'none'
      if (emptyText) emptyText.style.display = 'none'

      const cartItems = document.getElementById('cart-items')
      if (cartItems) {
        cartItems.innerHTML = `
          <div class="cart__empty-wrapper text-center mt-3">
            <img src="assets/images/empty_cart.svg" alt="Empty cart" class="cart__empty-img" />
            <p class="cart__empty-text">Все еще не выбрали зеленого друга?</p>
            <button type="button" class="cart__btn-pay" onclick="window.location.href='index.html'">Выбрать</button>
          </div>
        `
      }

      return
    } else {
      if (promoWrapper) promoWrapper.style.display = 'flex'
      if (clearBtn) clearBtn.style.display = 'inline-block'
      if (totalSection) totalSection.style.display = 'flex'
      if (subtotalSection) subtotalSection.style.display = 'flex'
      if (emptyText) emptyText.style.display = 'block'
    }

    this.displayCart(cart)
    this.calculateTotals(cart)
  }

  displayCart(items) {
    const cartItems = document.getElementById('cart-items')
    if (!cartItems) return

    cartItems.innerHTML = items
      .map(
        (item) =>
          `<div class="product-card" data-plant-id="${item.id}">
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p class="item-price" data-item-id="${item.id}">${(
            item.price * item.quantity
          ).toFixed(2)} ₽</p>
            <div class="product-quantity-controls">
              <button onclick="cartManager.updateQuantity(${
                item.id
              }, -1)" class="quantity-btn">-</button>
              <span>${item.quantity}</span>
              <button onclick="cartManager.updateQuantity(${
                item.id
              }, 1)" class="quantity-btn">+</button>
            </div>
          </div>`
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
      this.calculateTotals(cart)
      // Обновление цены товара производится в loadCart, поэтому отдельный updatePrice не обязателен
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

    document.getElementById('subtotal').textContent = `${subtotal.toFixed(2)} ₽`
    document.getElementById('discount').textContent = `${discount.toFixed(2)} ₽`
    document.getElementById('total').textContent = `${total.toFixed(2)} ₽`
  }

  //removeItem(itemId) {
  //let cart = JSON.parse(localStorage.getItem('cart') || '[]')
  //cart = cart.filter((item) => item.id !== itemId)
  //localStorage.setItem('cart', JSON.stringify(cart))
  //this.loadCart()
  //}

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
