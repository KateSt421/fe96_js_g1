global.TextEncoder = require('util').TextEncoder
global.TextDecoder = require('util').TextDecoder

const axios = require('axios')
const { JSDOM } = require('jsdom')
const fs = require('fs')
const path = require('path')

describe('PlantStore', () => {
  let PlantStore
  let document

  beforeAll(() => {
    // Загружаем HTML и создаём DOM
    const html = fs.readFileSync(
      path.resolve(__dirname, '../public/index.html'),
      'utf8'
    )
    const dom = new JSDOM(html, { runScripts: 'dangerously' })
    document = dom.window.document

    // Делаем window глобальным, если нужно
    global.window = dom.window
    global.document = document

    // Загружаем скрипт с классом PlantStore
    const scriptPath = path.resolve(__dirname, '../public/app.js')
    const code = fs.readFileSync(scriptPath, 'utf8')
    eval(code) // Это подключит класс PlantStore в глобальную область

    PlantStore = window.PlantStore || global.PlantStore
  })

  test('PlantStore должен быть определён', () => {
    expect(PlantStore).toBeDefined()
  })

  test('PlantStore должен загружать растения через axios', async () => {
    // Мокаем axios
    jest.spyOn(axios, 'get').mockResolvedValue({
      data: [
        { id: 1, name: 'Алоэ', price: 200 },
        { id: 2, name: 'Кактус', price: 300 },
      ],
    })

    const store = new PlantStore()
    await store.loadPlants()

    expect(store.plants.length).toBe(2)
    expect(store.plants[0].name).toBe('Алоэ')
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })
})
