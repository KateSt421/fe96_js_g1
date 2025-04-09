const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const plants = require('./data/catalog.js');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Database mock
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

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
