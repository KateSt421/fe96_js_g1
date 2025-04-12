## Работа с Гитом
Перед тем, как закоммитить изменения, убедитесь, что создали новую feature branch от develop branch. Вводим в терминал
```bash
git checkout develop
git checkout -b your-branch-name
```
Или
![н](https://github.com/user-attachments/assets/afcf3272-f6ac-45f8-83d6-6aed058a7b86) 
На этом скриншоте выделено красным, как проверить, что вы на главной ветке (develop), далее нажимаем на левый нижний угол, где написано develop и идем в самую верхнюю длинную кнопку посередине с лупой. Там выпадает список. Нажимаем на "Create new branch...". Далее серым текстом будет написано "Branch name". 
![е](https://github.com/user-attachments/assets/cacb96e5-6f24-4941-95b9-419cac5a2c5c)
Называем ветку осмысленно под задачу в которой работаем.
Теперь в нижнем левом углу должно быть написано имя вашей ветки.
![к](https://github.com/user-attachments/assets/9bdb8521-c88e-4b25-a585-b0e4c83fe036).





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
После этого в терминале будет написано "Server running on http://localhost:7001". Смотрим на последние цифры и вводим в браузере в адресной строке localhost:7001 (посление цифры могут меняться).
![о](https://github.com/user-attachments/assets/2620af59-01af-4767-8a86-36a95d147075)



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


