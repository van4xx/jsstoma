const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  color: {
    type: String
  }
});

const OrderSchema = new mongoose.Schema({
  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinic',
    required: true
  },
  patientName: {
    type: String,
    required: true
  },
  orderNumber: {
    type: String,
    required: function() {
      // orderNumber будет обязательным только при обновлении существующего документа
      return !this.isNew;
    },
    unique: true
  },
  items: [OrderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  deadline: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'cancelled'],
    default: 'pending'
  },
  paymentDate: {
    type: Date
  },
  notes: {
    type: String
  }
}, { timestamps: true });

// Generate order number before saving
OrderSchema.pre('save', async function(next) {
  try {
    if (this.isNew && !this.orderNumber) {
      console.log('Генерация номера заказа');
      const date = new Date();
      const year = date.getFullYear().toString().substr(-2);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      
      // Find the highest order number for today
      const prefix = `${year}${month}${day}`;
      const lastOrder = await this.constructor.findOne(
        { orderNumber: new RegExp('^' + prefix) },
        {},
        { sort: { orderNumber: -1 } }
      );
      
      let sequence = 1;
      if (lastOrder) {
        const lastSequence = parseInt(lastOrder.orderNumber.substring(6));
        sequence = lastSequence + 1;
      }
      
      this.orderNumber = `${prefix}${sequence.toString().padStart(4, '0')}`;
      console.log('Сгенерирован номер заказа:', this.orderNumber);
    }
    next();
  } catch (error) {
    console.error('Ошибка при генерации номера заказа:', error);
    next(error);
  }
});

module.exports = mongoose.model('Order', OrderSchema); 