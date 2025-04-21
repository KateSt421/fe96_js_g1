const messages = document.getElementById('messages');
const input = document.getElementById('questionList');
const sendButton = document.getElementById('userInput');

const botAnswers = [
  "Заказ оформляется в несколько шагов — это просто и быстро.",
  "Да, мы доставляем заказы — подробнее об условиях можно узнать на странице «Доставка».",
  "Обычно заказ обрабатывается в течение 1–2 рабочих дней.",
  "Мы принимаем оплату банковской картой и через интернет-банк.",
  "Уход за растениями мы описываем на карточке товара и добавляем в заказ.",
  "Мы стараемся упаковывать растения бережно, чтобы они приехали в хорошем состоянии.",
  "У нас часто проходят сезонные акции — заглядывайте в раздел «Скидки»!",
  "При самовывозе вы можете забрать заказ из нашего пункта в Москве.",
  "Конечно, вы можете заказать растение в подарок и добавить открытку!",
];

function addMessage(text, sender) {
  const msg = document.createElement('div');
  msg.classList.add('classmessage', sender);
  msg.textContent = text;
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
}
function sendMessage() {
  const selectedIndex = input.selectedIndex;
  const selectedText = input.value.trim();
  if (selectedIndex === 0 || !selectedText) return;
  addMessage(selectedText, 'user');
  // Рандомный ответ
  const randomIndex = Math.floor(Math.random() * botAnswers.length);
  const botReply = botAnswers[randomIndex];

  setTimeout(() => {
  addMessage(botReply, 'bot');
  }, 500);
  input.selectedIndex = 0; // сброс селекта на "Выберите вопрос"
}

input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    sendMessage();
  }
});

// Обработка кнопки
sendButton.addEventListener('click', sendMessage);