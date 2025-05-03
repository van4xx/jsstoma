const express = require('express');
const router = express.Router();
const Price = require('../models/Price');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Get prices for the clinic user is associated with
router.get('/', auth, async (req, res) => {
  try {
    // Admin can query any clinic, otherwise use user's clinic
    const clinicId = req.query.clinicId && req.user.role === 'admin' 
      ? req.query.clinicId 
      : req.user.clinicId;
    
    const prices = await Price.find({ clinicId }).sort({ price: 1 });
    
    // Populate product details
    const result = await Promise.all(prices.map(async (price) => {
      const product = await Product.findById(price.productId);
      return {
        ...price.toObject(),
        product: product ? {
          _id: product._id,
          name: product.name,
          code: product.code
        } : null
      };
    }));
    
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create price (admin only)
router.post('/', [auth, admin], async (req, res) => {
  try {
    const { productId, clinicId, price } = req.body;
    
    if (!productId || !clinicId || price === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Check if price already exists
    const existingPrice = await Price.findOne({ productId, clinicId });
    if (existingPrice) {
      return res.status(400).json({ message: 'Price already exists for this product and clinic' });
    }
    
    // Create price
    const newPrice = new Price({
      productId,
      clinicId,
      price
    });
    
    await newPrice.save();
    
    // Populate product details
    const product = await Product.findById(productId);
    const result = {
      ...newPrice.toObject(),
      product: product ? {
        _id: product._id,
        name: product.name,
        code: product.code
      } : null
    };
    
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update price (admin only)
router.put('/:id', [auth, admin], async (req, res) => {
  try {
    const { price } = req.body;
    
    if (price === undefined) {
      return res.status(400).json({ message: 'Price is required' });
    }
    
    // Find and update price
    const priceEntry = await Price.findById(req.params.id);
    
    if (!priceEntry) {
      return res.status(404).json({ message: 'Price not found' });
    }
    
    priceEntry.price = price;
    await priceEntry.save();
    
    // Populate product details
    const product = await Product.findById(priceEntry.productId);
    const result = {
      ...priceEntry.toObject(),
      product: product ? {
        _id: product._id,
        name: product.name,
        code: product.code
      } : null
    };
    
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete price (admin only)
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const price = await Price.findById(req.params.id);
    
    if (!price) {
      return res.status(404).json({ message: 'Price not found' });
    }
    
    await price.remove();
    res.json({ message: 'Price removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 