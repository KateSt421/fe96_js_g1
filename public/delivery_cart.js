document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('deliveryForm')

  // Инициализация datepicker
  $('#datepicker')
    .datepicker({
      format: 'yyyy-mm-dd',
      autoclose: true,
      todayHighlight: true,
      startDate: new Date(),
      endDate: '+2y',
      language: 'ru',
    })
    .datepicker('setDate', new Date())

  // Регулярные выражения для валидации
  const regexPatterns = {
    name: /^[a-zA-Zа-яА-ЯёЁ\s-]{2,50}$/u,
    street: /^[a-zA-Zа-яА-ЯёЁ0-9\s\-,.]{3,50}$/u,
    house: /^[a-zA-Zа-яА-ЯёЁ0-9\/-]{1,10}$/u,
    apartment: /^[a-zA-Zа-яА-ЯёЁ0-9\/-]{1,10}$/u,
  }

  // Функция валидации поля
  function validateField(field, regex) {
    const value = field.value.trim()
    const errorElement = field.nextElementSibling

    // 1. Проверяем, пустое ли поле
    if (!value) {
      field.classList.add('is-invalid')
      field.classList.remove('is-valid')
      field.style.borderColor = 'red'
      field.setAttribute('placeholder', field.placeholder + ' *')
      field.style.setProperty('--placeholder-color', 'red')

      // Устанавливаем разные сообщения для разных полей
      if (field.id === 'name') {
        errorElement.textContent = 'Укажите имя'
      } else if (field.id === 'street') {
        errorElement.textContent = 'Укажите улицу'
      } else if (field.id === 'house') {
        errorElement.textContent = 'Добавьте номер дома'
      } else if (field.id === 'apartment') {
        errorElement.textContent = 'Добавьте номер квартиры'
      }
      return false
    }

    // 2. Проверяем по regex, если поле не пустое
    const isValid = regex.test(value)

    if (!isValid) {
      field.classList.add('is-invalid')
      field.classList.remove('is-valid')
      field.style.borderColor = 'red'

      // Устанавливаем разные сообщения для разных полей при неверном формате
      if (field.id === 'name') {
        errorElement.textContent = 'Такого получателя не существует'
      } else if (field.id === 'street') {
        errorElement.textContent = 'Такой улицы не существует'
      } else if (field.id === 'house') {
        errorElement.textContent = 'Такого номера дома не существует'
      } else if (field.id === 'apartment') {
        errorElement.textContent = 'Неверный номер квартиры'
      }
    } else {
      field.classList.remove('is-invalid')
      field.classList.add('is-valid')
      field.style.borderColor = ''
      field.style.setProperty('--placeholder-color', '')
    }

    return isValid
  }

  // Валидация даты
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
    } else {
      dateField.classList.remove('is-invalid')
      dateField.classList.add('is-valid')
    }
    return isValid
  }

  // Валидация времени
  function validateTime(timeField) {
    if (!timeField.value) {
      timeField.classList.add('is-invalid')
      timeField.classList.remove('is-valid')
      return false
    } else {
      timeField.classList.remove('is-invalid')
      timeField.classList.add('is-valid')
      return true
    }
  }

  // Обработчик отправки формы
  form.addEventListener('submit', function (e) {
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
