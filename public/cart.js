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

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('deliveryForm')
  const submitButton = document.querySelector('.category-btn')

  // Регулярные выражения для валидации
  const regexPatterns = {
    name: /^[a-zA-Zа-яА-ЯёЁ\s-]{2,50}$/, // Имя: буквы, пробелы, дефисы, 2-50 символов
    street: /^[a-zA-Zа-яА-ЯёЁ0-9\s-.,]{3,50}$/, // Улица: буквы, цифры, пробелы, дефисы, точки, запятые
    house: /^[a-zA-Zа-яА-ЯёЁ0-9/-]{1,10}$/, // Дом: буквы, цифры, слэш, дефис (для случаев типа "12/3" или "12А")
    apartment: /^[a-zA-Zа-яА-ЯёЁ0-9/-]{1,10}$/, // Квартира: аналогично дому
  }

  // Функция валидации поля
  function validateField(field, regex) {
    const isValid = regex.test(field.value.trim())
    if (!isValid) {
      field.classList.add('is-invalid')
      field.classList.remove('is-valid')
    } else {
      field.classList.remove('is-invalid')
      field.classList.add('is-valid')
    }
    return isValid
  }

  // Валидация даты  НЕ РАБОТАЕТ
  function validateDate(dateField) {
    const selectedDate = new Date(dateField.value)
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Убираем время для сравнения только дат

    // Создаём дату, которая на 2 года больше текущей
    const maxAllowedDate = new Date()
    maxAllowedDate.setFullYear(today.getFullYear() + 2)
    maxAllowedDate.setHours(23, 59, 59, 999) // Конец дня

    const isValid = selectedDate >= today && selectedDate <= maxAllowedDate

    if (!isValid) {
      dateField.classList.add('is-invalid')
      dateField.classList.remove('is-valid')
      // Обновляем сообщение об ошибке
      const errorElement = dateField.nextElementSibling
      if (errorElement && errorElement.classList.contains('invalid-feedback')) {
        errorElement.textContent =
          'Пожалуйста, выберите дату между сегодняшним днём и ' +
          maxAllowedDate.toLocaleDateString()
      }
    } else {
      dateField.classList.remove('is-invalid')
      dateField.classList.add('is-valid')
    }
    return isValid
  }

  // Валидация времени (уже есть min/max в HTML, но проверим и в JS)
  function validateTime(timeField) {
    const timeValue = timeField.value
    const [hours, minutes] = timeValue.split(':').map(Number)
    const isValid =
      timeValue && hours >= 8 && (hours < 22 || (hours === 22 && minutes === 0))

    if (!isValid) {
      timeField.classList.add('is-invalid')
      timeField.classList.remove('is-valid')
    } else {
      timeField.classList.remove('is-invalid')
      timeField.classList.add('is-valid')
    }
    return isValid
  }

  // Обработчик отправки формы
  submitButton.addEventListener('click', function (e) {
    e.preventDefault()

    // Валидируем все поля
    const isNameValid = validateField(
      document.getElementById('name'),
      regexPatterns.name
    )
    const isStreetValid = validateField(
      document.getElementById('street'),
      regexPatterns.street
    )
    const isHouseValid = validateField(
      document.getElementById('house'),
      regexPatterns.house
    )
    const isApartmentValid = validateField(
      document.getElementById('apartment'),
      regexPatterns.apartment
    )
    const isDateValid = validateDate(document.getElementById('date'))
    const isTimeValid = validateTime(document.getElementById('time'))

    // Если все поля валидны, можно отправить форму
    if (
      isNameValid &&
      isStreetValid &&
      isHouseValid &&
      isApartmentValid &&
      isDateValid &&
      isTimeValid
    ) {
      // Здесь можно отправить форму, например:
      // form.submit();
      console.log('Форма валидна, отправляем данные')
      alert('Форма успешно отправлена!')
    } else {
      console.log('Форма содержит ошибки')
    }
  })

  // Добавляем обработчики для валидации при вводе (опционально)
  document.getElementById('name').addEventListener('input', function () {
    validateField(this, regexPatterns.name)
  })

  document.getElementById('street').addEventListener('input', function () {
    validateField(this, regexPatterns.street)
  })

  document.getElementById('house').addEventListener('input', function () {
    validateField(this, regexPatterns.house)
  })

  document.getElementById('apartment').addEventListener('input', function () {
    validateField(this, regexPatterns.apartment)
  })

  document.getElementById('date').addEventListener('change', function () {
    validateDate(this)
  })

  document.getElementById('time').addEventListener('change', function () {
    validateTime(this)
  })
})
