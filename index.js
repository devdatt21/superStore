const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/product');
const dotenv = require('dotenv');
dotenv.config();
const cors = require("cors");


const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection URI
const mongo_uri = process.env.mongo_uri;

// Connect to MongoDB and log connection status
mongoose.connect(mongo_uri, { useNewUrlParser: true, useUnifiedTopology: true });


const db = mongoose.connection;
db.on('error', (err) => console.error('MongoDB connection error:', err));
db.once('open', () => {
  console.log('Connected to MongoDB successfully');
});

app.use(cors());
app.use(express.json());
app.use(express.static('public'));


// Routes
app.post('/products', async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.status(201).send(product);
});

app.get('/products', async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

app.get('/refill', async (req, res) => {
  const products = await Product.find();
  const productsToRefill = products.filter(product => product.quantity < product.threshold);
  productsToRefill.sort((a, b) => a.quantity - b.quantity);
  res.send(productsToRefill);
});

app.get('/refill-page', (req, res) => {
  res.sendFile(__dirname + '/public/refill.html');
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
