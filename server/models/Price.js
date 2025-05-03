const mongoose = require('mongoose');

const PriceSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinic',
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
}, { timestamps: true });

// Compound index to ensure unique product-clinic pairs
PriceSchema.index({ productId: 1, clinicId: 1 }, { unique: true });

module.exports = mongoose.model('Price', PriceSchema); 