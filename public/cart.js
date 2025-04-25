class CartManager {
  constructor() {
    this.loadCart()
    this.initCheckout()
    this.activePromoCode = null

    const clearBtn = document.getElementById('clear-cart')
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        localStorage.setItem('cart', '[]')
        this.loadCart()
      })
    }

    const applyPromoBtn = document.querySelector('.promo__btn')
    const promoInput = document.querySelector('.promo__input')

    if (applyPromoBtn && promoInput) {
      applyPromoBtn.addEventListener('click', () => {
        const enteredCode = promoInput.value.trim().toLowerCase()
        this.activePromoCode = enteredCode === 'trava' ? 'trava' : null
        this.loadCart()
      })

      promoInput.addEventListener('input', () => {
        const currentCode = promoInput.value.trim().toLowerCase()
        if (currentCode !== 'trava') {
          this.activePromoCode = null
          this.loadCart()
        }
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
      .map((item) => {
        const isService = item.category === 'service'
        return `
        <div class="cart__item">
          <img src="${item.image}" alt="${item.name}" class="cart__image" />
          <div class="cart__item-content">
            <div class="cart__details">
              <p class="cart__name">${item.name}</p>
              <p class="cart__unit-price ${
                isService ? 'cart__unit-comment' : ''
              }">
                ${
                  isService
                    ? item.comment
                    : item.price.toLocaleString('ru-RU') + ' ₽'
                }
              </p>
            </div>
            <div class="cart__controls">
              ${
                !isService
                  ? `
                <div class="cart__quantity-controls">
                  <button class="cart__btn" onclick="cartManager.updateQuantity(${item.id}, -1)">-</button>
                  <span class="cart__count">${item.quantity}</span>
                  <button class="cart__btn" onclick="cartManager.updateQuantity(${item.id}, 1)">+</button>
                </div>`
                  : ''
              }
              <div class="cart__controls-bottom">
              <div class="cart__price-total">
                <span id="subtotal">${
                  isService
                    ? item.price.toLocaleString('ru-RU') + ' ₽'
                    : (item.price * item.quantity).toLocaleString('ru-RU') +
                      ' ₽'
                }</span>
              </div>
              <button class="cart__delete" onclick="cartManager.removeItem(${
                item.id
              })">
                <img src="assets/images/clear_cart.svg" alt="Delete item" />
              </button>
              </div>
            </div>
          </div>
        </div>
      `
      })
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
    }
  }

  calculateDiscount(total) {
    return this.activePromoCode === 'trava' && total > 100 ? total * 0.1 : 0
  }

  calculateTotals(items) {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
    const discount = this.calculateDiscount(subtotal)
    const total = subtotal - discount

    document.getElementById(
      'discount'
    ).textContent = `${discount.toLocaleString('ru-RU')} ₽`
    document.getElementById('total').textContent = `${total.toLocaleString(
      'ru-RU'
    )} ₽`
  }

  removeItem(itemId) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]')
    cart = cart.filter((item) => item.id !== itemId)
    localStorage.setItem('cart', JSON.stringify(cart))
    this.loadCart()
  }

  initCheckout() {
    const form = document.getElementById('checkout-form')
    const dateInput = document.getElementById('date')
    const timeInput = document.getElementById('time')

    const today = new Date()
    const dd = String(today.getDate()).padStart(2, '0')
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const yyyy = today.getFullYear()
    const formatted = `${yyyy}-${mm}-${dd}`
    if (dateInput) {
      dateInput.value = formatted
      dateInput.dataset.default = 'true'
      dateInput.style.color = '$Grey_94'

      dateInput.addEventListener('change', () => {
        if (!dateInput.value || dateInput.value === formatted) {
          dateInput.dataset.default = 'true'
          dateInput.style.color = '$Grey_94'
        } else {
          dateInput.removeAttribute('data-default')
          dateInput.style.color = '$Black_00'
        }
      })
    }

    if (timeInput) {
      const updateColor = () => {
        timeInput.style.color =
          timeInput.value && timeInput.value !== 'Любое'
            ? '#000'
            : 'rgba(0, 0, 0, 0.4)'
      }
      updateColor()
      timeInput.addEventListener('change', updateColor)
    }

    const fields = ['name', 'street', 'house', 'apt']
    fields.forEach((id) => {
      const el = document.getElementById(id)
      el.addEventListener('input', () => this.validateField(el, this.regex[id]))
    })

    dateInput.addEventListener('change', () => this.validateDate(dateInput))
    timeInput.addEventListener('change', () => this.validateTime(timeInput))

    form.addEventListener('submit', (e) => {
      e.preventDefault()

      const validations = [
        this.validateField(document.getElementById('name'), this.regex.name),
        this.validateField(
          document.getElementById('street'),
          this.regex.street
        ),
        this.validateField(document.getElementById('house'), this.regex.house),
        this.validateField(document.getElementById('apt'), this.regex.apt),
        this.validateDate(dateInput),
        this.validateTime(timeInput),
      ]

      const isValid = validations.every(Boolean)

      if (isValid) {
        alert('Форма успешно отправлена!')
        localStorage.removeItem('cart')
        this.loadCart()
      }
    })
  }

  get regex() {
    return {
      name: /^(?!.*[-\s]{2})[a-zA-Zа-яА-ЯёЁ][a-zA-Zа-яА-ЯёЁ\s-]*[a-zA-Zа-яА-ЯёЁ]$/u,
      street: /^[а-яА-ЯёЁa-zA-Z]+(?:[\s\-]?[а-яА-ЯёЁa-zA-Z0-9]+)*$/u,
      house: /^(\d+[a-zA-Zа-яА-ЯёЁ]?(\/\d+[a-zA-Zа-яА-ЯёЁ]?)?)$/u,
      apt: /^\d{1,5}[a-zA-Zа-яА-ЯёЁ]?$/u,
    }
  }

  validateField(field, regex) {
    const value = field.value.trim()
    const error = field.nextElementSibling

    const errorMessages = {
      name: {
        empty: 'Укажите имя',
        invalid: 'Такого получателя не существует',
      },
      street: {
        empty: 'Добавьте улицу',
        invalid: 'Такой улицы не существует',
      },
      house: {
        empty: 'Добавьте номер дома',
        invalid: 'Такого номера дома не существует',
      },
      apt: {
        empty: 'Добавьте номер квартиры',
        invalid: 'Неверный номер квартиры',
      },
    }

    const id = field.id
    if (!value) {
      field.classList.add('is-invalid')
      field.classList.remove('is-valid')
      error.textContent = errorMessages[id].empty
      return false
    }

    if (!regex.test(value)) {
      field.classList.add('is-invalid')
      field.classList.remove('is-valid')
      error.textContent = errorMessages[id].invalid
      return false
    }

    field.classList.remove('is-invalid')
    field.classList.add('is-valid')
    error.textContent = ''
    return true
  }
}

const cartManager = new CartManager()
module.exports = cartManager
