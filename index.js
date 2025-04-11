const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 7001;

// Configure Express for secure operation
app.set('trust proxy', 1); // Trust first proxy
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Import plants data
const plants = require('./data/catalog.js');
let cart = [];

// Plant endpoints
app.get('/api/plants', (req, res) => res.json(plants));
app.get('/api/plants/search', (req, res) => {
  const { query } = req.query;
  const filtered = plants.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );
  res.json(filtered);
});
app.get('/api/plants/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const plant = plants.find(p => p.id === id);
  if (plant) {
    res.json(plant);
  } else {
    res.status(404).json({ error: 'Plant not found' });
  }
});
app.post('/api/plants', (req, res) => {
  plants.push(req.body);
  res.status(201).json(req.body);
});

// Cart endpoints
app.get('/api/cart', (req, res) => res.json(cart));
app.post('/api/cart', (req, res) => {
  cart.push(req.body);
  res.status(201).json(cart);
});

// Default to localhost for security, but allow override via environment variable
const host = process.env.HOST || 'localhost';
app.listen(port, host, () => {
  console.log(`Server running on http://${host}:${port}`);
  if (host === 'localhost') {
    console.log("If you're on macOS and can't connect, try: HOST=127.0.0.1 npm start");
  }
});

