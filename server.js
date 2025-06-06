const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));


const products = [
  { id: 1, name: 'Running Shoes', price: 2800, description: 'High-performance running shoes for all terrains.' },
  { id: 2, name: 'Casual Sneakers', price: 1700, description: 'Stylish and comfortable sneakers for everyday wear.' },
  { id: 3, name: 'Formal Shoes', price: 2750, description: 'Elegant formal shoes for business and special occasions.' },
  { id: 4, name: 'Sports Shoes', price: 2000, description: 'Lightweight and durable shoes for all your sports activities.' },
  { id: 5, name: 'Boots', price: 2500, description: 'Stylish boots perfect for outdoor adventures and casual wear.' },
  { id: 6, name: 'Gucci Sandals', price: 13100, description: 'Comfortable and breathable sandals for warm weather.' },
  { id: 7, name: 'Loafers', price: 2700, description: 'Classic loafers for a smart and casual look.' },
  { id: 8, name: 'Slippers', price: 11150, description: 'Soft and cozy slippers for indoor comfort.' },
  { id: 9, name: 'Trail Running Shoes', price: 2400, description: 'Designed for rugged trails with superior grip and comfort.' },
  { id: 10, name: 'Flip-Flops', price: 150, description: 'Lightweight and comfortable flip-flops for casual wear.' },
];

// Routes
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  console.log(`Contact form submitted: Name: ${name}, Email: ${email}, Message: ${message}`);
  res.status(200).send({ message: 'Thank you for contacting us!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
