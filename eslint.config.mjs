import globals from 'globals'

;/ @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      parserOptions: {
        sourceType: 'module', // Поддержка ES-модулей
      },
    },
    ignores: ['node_modules/', 'dist/'], // Игнорировать ненужные папки
  },
  {
    files: ['/*.js'], // Применяется к JS-файлам
    languageOptions: {
      sourceType: 'module', // Поддержка ES-модулей
      globals: globals.browser, // Глобальные переменные браузера
    },
    rules: {
      'no-unused-vars': 'warn', // Предупреждение для неиспользуемых переменных
      'no-console': 'off', // Разрешить использование console.log
    },
  },
]
