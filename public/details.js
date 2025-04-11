
class PlantDetails {
  constructor() {
    this.loadPlantDetails();
    this.initSearch();
  }

  async initSearch() {
    const searchInput = document.getElementById('search');
    const searchBtn = document.getElementById('searchBtn');

    // Click event for search button
    searchBtn.addEventListener('click', () => {
      if (searchInput.value.length >= 3) {
        window.location.href = `/?search=${encodeURIComponent(searchInput.value)}`;
      }
    });

    // Enter key event for search input
    searchInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter' && searchInput.value.length >= 3) {
        event.preventDefault();
        window.location.href = `/?search=${encodeURIComponent(searchInput.value)}`;
      }
    });
  }

  async loadPlantDetails() {
    // Get plant ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const plantId = parseInt(urlParams.get('id'));

    if (!plantId) {
      this.showError('No plant ID provided');
      return;
    }

    try {
      // Fetch plant details from API
      const response = await axios.get(`/api/plants/${plantId}`);
      const plant = response.data;
      this.displayPlantDetails(plant);
    } catch (error) {
      console.error('Error loading plant details:', error);
      this.showError('Plant not found or error loading plant details');
    }
  }

  displayPlantDetails(plant) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartItem = cart.find(item => item.id === plant.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    const detailsContainer = document.getElementById('plant-details');
    detailsContainer.innerHTML = `
      <div class="row">
        <div class="col-md-6">
          <div class="plant-image-container">
            <img src="${plant.image}" alt="${plant.name}">
          </div>
        </div>
        <div class="col-md-6">
          <h1>${plant.name}</h1>
          <div class="plant-details-price">$${plant.price.toFixed(2)}</div>
          <p class="plant-details-description">
            Premium quality ${plant.name.toLowerCase()} for your home or garden.
            This beautiful plant is perfect for adding a touch of natural beauty to any space.
          </p>
          <p><strong>Category:</strong> ${plant.category.charAt(0).toUpperCase() + plant.category.slice(1)}</p>
          <div class="plant-details-actions">
            ${quantity === 0 ?
              `<button class="add-to-cart-btn" onclick="plantDetails.updateQuantity(${plant.id}, 1)">Add to Cart</button>` :
              `<div class="quantity-controls">
                  <button onclick="plantDetails.updateQuantity(${plant.id}, -1)">-</button>
                  <span>${quantity}</span>
                  <button onclick="plantDetails.updateQuantity(${plant.id}, 1)">+</button>
               </div>`
            }
            </div>
        </div>
      </div>
      <nav class="mt-3">
        <a href="/" class="btn btn-outline-success">&larr; Back to Shop</a>
      </nav>
    `;
  }

  showError(message) {
    const detailsContainer = document.getElementById('plant-details');
    detailsContainer.innerHTML = `
      <div class="alert alert-danger" role="alert">
        ${message}
      </div>
      <a href="/" class="btn btn-primary">Back to Shop</a>
    `;
  }

  updateQuantity(plantId, change) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const plant = {id: plantId};

    try {
      // Get current plant data
      const existingItem = cart.find(item => item.id === plantId);

      if (existingItem) {
        existingItem.quantity = Math.max(0, existingItem.quantity + change);
        if (existingItem.quantity === 0) {
          const index = cart.indexOf(existingItem);
          cart.splice(index, 1);
        }
      } else if (change > 0) {
        // Need to get plant data first
        axios.get(`/api/plants/${plantId}`)
          .then(response => {
            cart.push({ ...response.data, quantity: 1 });
            localStorage.setItem('cart', JSON.stringify(cart));
            this.loadPlantDetails();
          });
        return;
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      this.loadPlantDetails();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  }
}

const plantDetails = new PlantDetails();
