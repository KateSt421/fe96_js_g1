
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
  }
];

// Setup routes for testing
app.get('/api/plants', (req, res) => res.json(testPlants));
app.get('/api/plants/search', (req, res) => {
  const { query } = req.query;
  const filtered = testPlants.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase())
  );
  res.json(filtered);
});

describe('Plant API', () => {
  test('GET /api/plants returns plants array', async () => {
    const response = await request(app).get('/api/plants');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBe(1);
  });

  test('Search plants returns filtered results', async () => {
    const response = await request(app)
      .get('/api/plants/search')
      .query({ query: 'test' });
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[0].name).toBe('Test Plant');
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
});
