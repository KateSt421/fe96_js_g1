document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('checkout-form')
  const submitButton = document.querySelector('.cart__btn-pay')

  // Регулярные выражения для валидации
  const regexPatterns = {
    name: /^(?!.*[- ]{2})[a-zA-Zа-яА-ЯёЁ][a-zA-Zа-яА-ЯёЁ\s-]*[a-zA-Zа-яА-ЯёЁ]$/u,
    street: /^(?=.*[a-zA-Zа-яА-ЯёЁ])[a-zA-Zа-яА-ЯёЁ0-9\s\-,.]{3,50}$/u,
    house:
      /^(?:\d+[a-zA-Zа-яА-ЯёЁ]?|[a-zA-Zа-яА-ЯёЁ]\d*)(?:\/\d+[a-zA-Zа-яА-ЯёЁ]?)?$/u,
    apt: /^(?:\d+[a-zA-Zа-яА-ЯёЁ]?|[a-zA-Zа-яА-ЯёЁ]\d*)(?:\/\d+[a-zA-Zа-яА-ЯёЁ]?)?$/u,
  }

  function validateField(field, regex) {
    const value = field.value.trim()
    const errorElement = field.nextElementSibling

    if (!value) {
      field.classList.add('is-invalid')
      field.classList.remove('is-valid')

      // Устанавливаем сообщения об ошибках
      if (field.id === 'name') {
        errorElement.textContent = 'Укажите имя'
      } else if (field.id === 'street') {
        errorElement.textContent = 'Укажите улицу'
      } else if (field.id === 'house') {
        errorElement.textContent = 'Добавьте номер дома'
      } else if (field.id === 'apt') {
        errorElement.textContent = 'Добавьте номер квартиры'
      }
      return false
    }

    const isValid = regex.test(value)

    if (!isValid) {
      field.classList.add('is-invalid')
      field.classList.remove('is-valid')

      if (field.id === 'name') {
        errorElement.textContent = 'Такого получателя не существует'
      } else if (field.id === 'street') {
        errorElement.textContent = 'Такой улицы не существует'
      } else if (field.id === 'house') {
        errorElement.textContent = 'Такого номера дома не существует'
      } else if (field.id === 'apt') {
        errorElement.textContent = 'Неверный номер квартиры'
      }
    } else {
      field.classList.remove('is-invalid')
      field.classList.add('is-valid')
      errorElement.textContent = ''
    }

    return isValid
  }

  function validateDate(dateField) {
    if (!dateField.value) {
      dateField.classList.add('is-invalid')
      dateField.classList.remove('is-valid')
      return false
    }

    const selectedDate = new Date(dateField.value + 'T00:00:00')
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const maxAllowedDate = new Date()
    maxAllowedDate.setFullYear(today.getFullYear() + 2)
    maxAllowedDate.setHours(0, 0, 0, 0)

    const isValid = selectedDate >= today && selectedDate <= maxAllowedDate

    if (!isValid) {
      dateField.classList.add('is-invalid')
      dateField.classList.remove('is-valid')
      dateField.nextElementSibling.textContent =
        'Выберите дату в пределах 2 лет от текущей'
    } else {
      dateField.classList.remove('is-invalid')
      dateField.classList.add('is-valid')
      dateField.nextElementSibling.textContent = ''
    }
    return isValid
  }

  function validateTime(timeField) {
    if (timeField.value === 'Любое' || !timeField.value) {
      timeField.classList.add('is-invalid')
      timeField.classList.remove('is-valid')
      return false
    } else {
      timeField.classList.remove('is-invalid')
      timeField.classList.add('is-valid')
      return true
    }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault()

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
    const isAptValid = validateField(
      document.getElementById('apt'),
      regexPatterns.apt
    )
    const isDateValid = validateDate(document.getElementById('date'))
    const isTimeValid = validateTime(document.getElementById('time'))

    if (
      isNameValid &&
      isStreetValid &&
      isHouseValid &&
      isAptValid &&
      isDateValid &&
      isTimeValid
    ) {
      console.log('Форма валидна, отправляем данные')
      alert('Форма успешно отправлена!')
    } else {
      console.log('Форма содержит ошибки')
    }
  })

  // Добавляем обработчики для валидации при вводе
  document.getElementById('name').addEventListener('input', function () {
    validateField(this, regexPatterns.name)
  })

  document.getElementById('street').addEventListener('input', function () {
    validateField(this, regexPatterns.street)
  })

  document.getElementById('house').addEventListener('input', function () {
    validateField(this, regexPatterns.house)
  })

  document.getElementById('apt').addEventListener('input', function () {
    validateField(this, regexPatterns.apt)
  })

  document.getElementById('date').addEventListener('change', function () {
    validateDate(this)
  })

  document.getElementById('time').addEventListener('change', function () {
    validateTime(this)
  })
})
