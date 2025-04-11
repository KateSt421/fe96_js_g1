
class PlantStore {
  constructor() {
    this.initSearch();
    this.loadPlants();
    this.initCategories();
    this.plants = [];
    this.currentFilter = '';
    this.currentCategory = 'all';
  }

  async initSearch() {
    const searchInput = document.getElementById('search');
    const searchBtn = document.getElementById('searchBtn');

    // Click event for search button
    searchBtn.addEventListener('click', () => {
        this.searchPlants(searchInput.value);
    });

    // Enter key event for search input
    searchInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter' && searchInput.value.length >= 3) {
        event.preventDefault();
        this.searchPlants(searchInput.value);
      }
    });
  }

  async searchPlants(query) {
    this.currentFilter = query;
    try {
      const response = await axios.get(`/api/plants/search`, {
        params: { query: query }
      });
      this.displayPlants(response.data);
    } catch (error) {
      console.error('Search error:', error);
      this.displayPlants([]);
    }
  }

  async loadPlants() {
    const response = await axios.get('/api/plants');
    this.plants = response.data;
    this.displayPlants(this.plants);
  }

  initCategories() {
    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.filterByCategory(btn.dataset.category);
      });
    });
    // Set 'Show All' as initially active
    document.querySelector('[data-category="all"]').classList.add('active');
  }

  filterByCategory(category) {
    this.currentCategory = category;
    let filtered = this.plants;

    if (category !== 'all') {
      filtered = filtered.filter(plant => plant.category === category);
    }

    if (this.currentFilter) {
      filtered = filtered.filter(plant =>
        plant.name.toLowerCase().includes(this.currentFilter.toLowerCase())
      );
    }

    this.displayPlants(filtered);
  }

  displayPlants(plants) {
    const grid = document.getElementById('plants-grid');
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');

    grid.innerHTML = plants.map(plant => {
      const cartItem = cart.find(item => item.id === plant.id);
      const quantity = cartItem ? cartItem.quantity : 0;
      const inCartClass = quantity > 0 ? 'in-cart' : '';

      return `
        <div class="plant-card ${inCartClass}" data-plant-id="${plant.id}">
          <img src="${plant.image}" alt="${plant.name}">
          <button class="details-btn" onclick="window.location.href='/details.html?id=${plant.id}'">Details</button>
          <h3>${plant.name}</h3>
          <p>$${plant.price.toFixed(2)}</p>
          ${quantity === 0 ?
            `<button class="add-to-cart-btn" onclick="plantStore.updateQuantity(${plant.id}, 1)">Add to Cart</button>` :
            `<div class="quantity-controls">
                <button onclick="plantStore.updateQuantity(${plant.id}, -1)">-</button>
                <span>${quantity}</span>
                <button onclick="plantStore.updateQuantity(${plant.id}, 1)">+</button>
             </div>`
          }
        </div>
      `;
    }).join('');
  }

  updateQuantity(plantId, change) {
    const plant = this.plants.find(p => p.id === plantId);
    if (plant) {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = cart.find(item => item.id === plantId);

      if (existingItem) {
        existingItem.quantity = Math.max(0, existingItem.quantity + change);
        if (existingItem.quantity === 0) {
          const index = cart.indexOf(existingItem);
          cart.splice(index, 1);
        }
      } else if (change > 0) {
        cart.push({ ...plant, quantity: 1 });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      this.filterByCategory(this.currentCategory);

      if (change > 0) {
        const button = document.querySelector(`[data-plant-id="${plantId}"] .add-to-cart-btn`);
        if (button) {
          button.classList.add('clicked');
          setTimeout(() => button.classList.remove('clicked'), 1000);
        }
      }
    }
  }
}

const plantStore = new PlantStore();
