const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Price = require('../models/Price');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Get all products (admin)
router.get('/all', [auth, admin], async (req, res) => {
  try {
    const products = await Product.find().sort({ name: 1 });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get products with prices for a clinic
router.get('/', auth, async (req, res) => {
  try {
    const clinicId = req.user.clinicId;
    
    // Get all active products
    const products = await Product.find({ active: true }).sort({ name: 1 });
    
    // Get prices for this clinic
    const prices = await Price.find({ clinicId });
    
    // Map products with their prices
    const productsWithPrices = products.map(product => {
      const priceEntry = prices.find(p => p.productId.toString() === product._id.toString());
      return {
        _id: product._id,
        name: product.name,
        description: product.description,
        code: product.code,
        price: priceEntry ? priceEntry.price : null
      };
    });
    
    res.json(productsWithPrices);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create product (admin only)
router.post('/', [auth, admin], async (req, res) => {
  try {
    const { name, description, code } = req.body;
    
    const product = new Product({
      name,
      description,
      code
    });
    
    await product.save();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product (admin only)
router.put('/:id', [auth, admin], async (req, res) => {
  try {
    const { name, description, code, active } = req.body;
    
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    product.name = name || product.name;
    product.description = description || product.description;
    product.code = code || product.code;
    product.active = active !== undefined ? active : product.active;
    
    await product.save();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Set price for product and clinic (admin only)
router.post('/price', [auth, admin], async (req, res) => {
  try {
    const { productId, clinicId, price } = req.body;
    
    // Validate product and clinic
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Update or create price
    let priceEntry = await Price.findOne({ productId, clinicId });
    
    if (priceEntry) {
      priceEntry.price = price;
    } else {
      priceEntry = new Price({
        productId,
        clinicId,
        price
      });
    }
    
    await priceEntry.save();
    res.json(priceEntry);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 