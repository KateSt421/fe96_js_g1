class PlantStore {
  constructor(currentCategory = 'flowering') {
    this.initSearch()
    this.loadPlants()
    this.initCategories()
    this.plants = []
    this.currentFilter = ''
    this.currentCategory = currentCategory
    this.updateCartCount()
  }

  async initSearch() {
    const searchInput = document.getElementById('search')
    // const searchBtn = document.getElementById('searchBtn');

    // Click event for search button
    searchInput.addEventListener('click', () => {
      this.searchPlants(searchInput.value)
    })

    // Enter key event for search input
    searchInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && searchInput.value.length >= 3) {
        event.preventDefault()
        this.searchPlants(searchInput.value)
      }
    })
  }

  async searchPlants(query) {
    this.currentFilter = query
    try {
      const response = await axios.get(`/api/plants/search`, {
        params: { query: query },
      })
      this.displayPlants(response.data)
    } catch (error) {
      console.error('Search error:', error)
      this.displayPlants([])
    }
  }

  async loadPlants() {
    const response = await axios.get('/api/plants')
    this.plants = response.data
    const filtered = this.plants.filter(
      (plant) => plant.category === this.currentCategory
    )
    this.displayPlants(filtered)
  }

  initCategories() {
    document.querySelectorAll('.category-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document
          .querySelectorAll('.category-btn')
          .forEach((b) => b.classList.remove('active'))
        btn.classList.add('active')
        this.filterByCategory(btn.dataset.category)
      })
    })
    // Set 'Show Flowering' as initially active
    const activeCategory = document.querySelector('[data-category="flowering"]')
    if (activeCategory) {
      activeCategory.classList.add('active')
    } else
      document
        .querySelector('[data-category="service"]')
        .classList.add('active')
  }

  filterByCategory(category) {
    this.currentCategory = category
    let filtered = this.plants

    if (category !== 'all') {
      filtered = filtered.filter((plant) => plant.category === category)
    }

    if (this.currentFilter) {
      filtered = filtered.filter((plant) =>
        plant.name.toLowerCase().includes(this.currentFilter.toLowerCase())
      )
    }

    this.displayPlants(filtered)
  }

  displayPlants(plants) {
    const grid = document.getElementById('plants-grid')
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')

    grid.innerHTML = plants
      .map((plant) => {
        const cartItem = cart.find((item) => item.id === plant.id)
        const quantity = cartItem ? cartItem.quantity : 0
        const inCartClass = quantity > 0 ? 'in-cart' : ''

        return `
        <div class="product-card ${inCartClass}" data-plant-id="${plant.id}">
          <img src="${plant.image}" alt="${plant.name}">
          <button class="product-details-btn" onclick="window.location.href='/details.html?id=${
            plant.id
          }'">Подробнее..</button>
          <h3>${plant.name}</h3>
          <p class"cart-product-price">${plant.price.toFixed(2)} Руб.</p>
          <p class="product-item-description">${plant.description}</p>
          <p>${plant.comment}</p>
          ${
            quantity === 0
              ? `<button class="product-add-to-cart-btn" onclick="plantStore.updateQuantity(${plant.id}, 1)">Добавить</button>`
              : `<div class="product-quantity-controls">

                <button onclick="plantStore.updateQuantity(${plant.id}, -1)">-</button>
                <span>${quantity}</span>
                <button onclick="plantStore.updateQuantity(${plant.id}, 1)">+</button>
            </div>`
          }
        </div>
      `
      })
      .join('')
  }

  updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const totalCount = cart.reduce((total, item) => total + item.quantity, 0)
    const cartCountElement = document.getElementById('cart-count')

    if (totalCount > 0) {
      cartCountElement.textContent = totalCount
      cartCountElement.style.display = 'block'
      cartCountElement.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.9)'
    } else {
      cartCountElement.textContent = ''
      cartCountElement.style.display = 'none'
      cartCountElement.style.textShadow = 'none'
    }
  }

  updateQuantity(plantId, change) {
    const plant = this.plants.find((p) => p.id === plantId)
    if (plant) {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      const existingItem = cart.find((item) => item.id === plantId)

      if (existingItem) {
        existingItem.quantity = Math.max(0, existingItem.quantity + change)
        if (existingItem.quantity === 0) {
          const index = cart.indexOf(existingItem)
          cart.splice(index, 1)
        }
      } else if (change > 0) {
        cart.push({ ...plant, quantity: 1 })
      }

      localStorage.setItem('cart', JSON.stringify(cart))
      this.updateCartCount()
      this.filterByCategory(this.currentCategory)

      if (change > 0) {
        const button = document.querySelector(
          `[data-plant-id="${plantId}"] .add-to-cart-btn`
        )
        if (button) {
          button.classList.add('clicked')
          setTimeout(() => button.classList.remove('clicked'), 1000)
        }
      }
    }
  }
}

const plantStore = new PlantStore()
window.PlantStore = PlantStore
