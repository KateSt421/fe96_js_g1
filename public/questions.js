const messages = document.getElementById('messages');
const input = document.getElementById('questionList');

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
const searchInput = document.getElementById('userInput');
searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && searchInput.value.length >= 3) {
    event.preventDefault();
    this.searchPlants(searchInput.value);
  }
});

    addMessage(text, 'user');
    function sendMessage() {
      const text = input.value.trim();
      if (text === "") return;
      addMessage(text, 'user');
      input.value = '';

  // Рандомный ответ
  const randomIndex = Math.floor(Math.random() * botAnswers.length);
  const botReply = botAnswers[randomIndex];

  setTimeout(() => {
    addMessage(botReply, 'bot');
  }, 500);
}