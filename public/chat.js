document.addEventListener('DOMContentLoaded', () => {
    const chatButton = document.getElementById('chatButton');
    const chatModal = document.getElementById('chatModal');
    const closeButton = document.getElementById('closeButton');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const chatMessages = document.getElementById('chatMessages');

    // Анимация открытия/закрытия чата
    const toggleChat = () => {
        chatModal.style.display = chatModal.style.display === 'block' ? 'none' : 'block';
    };

    chatButton.addEventListener('click', toggleChat);
    closeButton.addEventListener('click', toggleChat);

    // Отправка сообщения
    const sendMessage = async () => {
        const message = userInput.value.trim();
        if (!message) return;

        // Добавление сообщения пользователя
        addMessage(message, 'user');
        userInput.value = '';

        try {
            // Тайм-аут 3 секунды
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);

            const response = await fetch('/api/chat?question=' + encodeURIComponent(message), {
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) throw new Error('Ошибка сервера');

            const data = await response.json();
            addMessage(data.answer, 'bot');
        } catch (error) {
            // Показ страницы 500-chat.html при ошибке
            chatMessages.innerHTML = `
                <iframe src="500-chat.html"
                    style="width:100%; height:400px; border:none;"
                    title="Ошибка сервера">
                </iframe>
            `;
        }
    };

    // Добавление сообщения в чат
    const addMessage = (text, sender) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    // Обработчики событий
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
});