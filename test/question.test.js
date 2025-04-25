const fs = require('fs');
const path = require('path')
// Оборачиваем в describe для группировки
describe('Тестирование addMessage', () => {
// Перед всеми тестами загружаем HTML и эмулируем браузер
beforeAll(() => {
// Загружаем HTML-файл, как будто он открыт в браузере
const html = fs.readFileSync(
path.resolve(__dirname, '../public/questions.html'),
'utf8'
);
document.documentElement.innerHTML = html
// Подключаем твой JS-файл
const scriptContent = require('../public/questions')
messages = document.getElementById('messages');
});
// Сам тест
test('addMessage добавляет сообщение в DOM', () => {
const Input = document.getElementById('questionList');
const selectValue = Input.options[0].value;
console.log(selectValue);
// Берём последнее добавленное сообщение
const lastMsg = messages.lastChild;
// Проверяем, что оно добавлено
expect(selectValue).not.toBeNull();
// Проверяем, что текст совпадает
expect(selectValue).toBe("Выберите вопрос");
});
});