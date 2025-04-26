let submitButton = document.getElementById('submit_form')
let form = document.getElementById('email_form')
let responseMessage = document.getElementById('responseMessage')
const newText = form.subject
form.subject.value =
  "Привет! Команда Planty'x надеется, что ваши новые растения прекрасно осваиваются в вашем доме! Уход за растениями порой непрост, поэтому мы предлагаем несколько способов получить свежие советы и поддержку:1. Блог Planty'x: Советы по уходу, решению проблем и выбору грунтов; 2. База знаний: Ответы на часто задаваемые вопросы о растениях; 3. Персональная консультация: Отправьте фото вашего растения и вопрос на plantyx@mail.ru; 4. Социальные сети: Новости, советы и вдохновение; 5. Онлайн-калькулятор полива: Определите оптимальный режим полива. Мы верим, что у вас все получится! Если вам нужна помощь, просто свяжитесь с нами. С наилучшими пожеланиями, Команда Planty'x!"

// Функция для валидации email
function validateEmail(email) {
  const re = /^[^s@]+@[^s@]+.[^s@]+$/
  return re.test(String(email).toLowerCase())
}
