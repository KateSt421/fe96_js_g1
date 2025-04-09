## Работа с Гитом
Перед тем, как закоммитить изменения, убедитесь, что создали новую feature branch от develop branch. 
```bash
git checkout develop
git checkout -b your-branch-name
```
## 🧰 Установка и запуск

### Установка зависимостей

Убедитесь, что у вас установлен Node.js. Затем установите зависимости:

```bash
npm install
```
### Запуск сервера с фейковым API

```
 npm start
```
### 🧪 Проверка и форматирование кода

В проекте настроены следующие инструменты:
ESLint — для проверки JavaScript-кода
Stylelint — для проверки CSS
Prettier — для автоформатирования

Команды:
```
npm run lint           # Проверка JS-кода
npm run lint:fix       # Автоисправление JS
npm run lint:css       # Проверка CSS
npm run lint:css:fix   # Автоисправление CSS
npx prettier --write . # Форматирование всего проекта
```
### ⚙️ Настройка Prettier в VS Code
Добавьте в settings.json редактора:
```
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```
### 👩‍💻 Команда проекта



### 💬 По вопросам и предложениям — пишите в Telegram.


