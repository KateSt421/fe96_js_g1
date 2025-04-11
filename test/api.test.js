
const request = require('supertest');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Mock data for testing
const testPlants = [
  {
    id: 1,
    name: "Test Plant",
    price: 29.99,
    category: "care"
  },
  {
    id: 2,
    name: "Monstera",
    price: 39.99,
    category: "indoor"
  },
  {
    id: 3,
    name: "Rose Bush",
    price: 24.99,
    category: "outdoor"
  }
];

// Setup routes for testing
app.get('/api/plants', (req, res) => res.json(testPlants));
app.get('/api/plants/search', (req, res) => {
  const { query } = req.query;
  // If query is empty or not provided, return all plants (simulating "show all")
  if (!query || query.trim() === '') {
    return res.json(testPlants);
  }

  const filtered = testPlants.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );
  res.json(filtered);
});

// Add plant details endpoint for testing
app.get('/api/plants/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const plant = testPlants.find(p => p.id === id);
  if (plant) {
    res.json(plant);
  } else {
    res.status(404).json({ error: 'Plant not found' });
  }
});

describe('Plant API', () => {
  test('GET /api/plants returns plants array', async () => {
    const response = await request(app).get('/api/plants');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBe(3);
  });

  test('Search plants returns filtered results', async () => {
    const response = await request(app)
      .get('/api/plants/search')
      .query({ query: 'test' });
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[0].name).toBe('Test Plant');
  });

  test('Search works with "all" category shown', async () => {
    // First verify we have plants across different categories
    const allPlants = testPlants;
    const categories = [...new Set(allPlants.map(plant => plant.category))];
    expect(categories.length).toBeGreaterThan(1);

    // Now test search with 'all' category filter (simulating frontend behavior)
    const searchTerm = 'a'; // Should match partial strings in multiple items
    const filtered = allPlants.filter(plant =>
      plant.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Verify multiple categories are in search results
    const resultCategories = [...new Set(filtered.map(plant => plant.category))];
    expect(resultCategories.length).toBeGreaterThan(1);

    // Test actual API endpoint
    const response = await request(app)
      .get('/api/plants/search')
      .query({ query: searchTerm });
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(1);

    // Verify we got plants from different categories
    const apiResultCategories = [...new Set(response.body.map(plant => plant.category))];
    expect(apiResultCategories.length).toBeGreaterThan(1);
  });

  test('Search with empty query returns all plants', async () => {
    const response = await request(app)
      .get('/api/plants/search')
      .query({ query: '' });
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBe(testPlants.length);
  });

  test('Category filtering works correctly', () => {
    const plants = testPlants;
    const careProducts = plants.filter(plant => plant.category === 'care');
    expect(careProducts.length).toBe(1);
    expect(careProducts[0].category).toBe('care');
  });

  test('Cart calculations are correct', () => {
    const cart = [
      { id: 1, price: 80, quantity: 1 },
      { id: 2, price: 30, quantity: 2 }
    ];

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    expect(subtotal).toBe(140);

    const discount = subtotal > 100 ? subtotal * 0.1 : 0;
    expect(discount).toBe(14);

    const total = subtotal - discount;
    expect(total).toBe(126);
  });

  // New tests for plant details API functionality
  describe('Plant Details API', () => {
    test('GET /api/plants/:id returns the correct plant', async () => {
      const response = await request(app).get('/api/plants/2');
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(2);
      expect(response.body.name).toBe('Monstera');
      expect(response.body.category).toBe('indoor');
    });

    test('GET /api/plants/:id returns 404 for non-existent plant', async () => {
      const response = await request(app).get('/api/plants/999');
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Plant not found');
    });

    test('GET /api/plants/:id handles invalid ID format', async () => {
      const response = await request(app).get('/api/plants/invalid');
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Plant not found');
    });

    test('Plant details contain all required fields', async () => {
      const response = await request(app).get('/api/plants/3');
      expect(response.status).toBe(200);

      // Check that the plant object has all required fields
      const plant = response.body;
      expect(plant).toHaveProperty('id');
      expect(plant).toHaveProperty('name');
      expect(plant).toHaveProperty('price');
      expect(plant).toHaveProperty('category');

      // Check the specific values
      expect(plant.id).toBe(3);
      expect(plant.name).toBe('Rose Bush');
      expect(plant.price).toBe(24.99);
      expect(plant.category).toBe('outdoor');
    });
  });
});
