const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const Price = require('../models/Price');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Get orders for the logged-in clinic
router.get('/', auth, async (req, res) => {
  try {
    const clinicId = req.user.clinicId;
    
    // Admin can filter by clinicId, otherwise use user's clinic
    const filter = req.user.role === 'admin' 
      ? (req.query.clinicId ? { clinicId: req.query.clinicId } : {})
      : { clinicId };
    
    // Status filter
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .populate('clinicId', 'name');
    
    const result = await Promise.all(orders.map(async (order) => {
      // Populate items with product details
      const items = await Promise.all(order.items.map(async (item) => {
        const product = await Product.findById(item.productId);
        return {
          ...item.toObject(),
          product: product ? {
            name: product.name,
            code: product.code
          } : null
        };
      }));
      
      return {
        ...order.toObject(),
        items
      };
    }));
    
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get unpaid orders for clinic
router.get('/unpaid', auth, async (req, res) => {
  try {
    const clinicId = req.user.clinicId;
    
    // Admin can filter by clinicId, otherwise use user's clinic
    const filter = req.user.role === 'admin' 
      ? (req.query.clinicId ? { clinicId: req.query.clinicId, status: 'pending' } : { status: 'pending' })
      : { clinicId, status: 'pending' };
    
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .populate('clinicId', 'name');
    
    const result = await Promise.all(orders.map(async (order) => {
      // Populate items with product details
      const items = await Promise.all(order.items.map(async (item) => {
        const product = await Product.findById(item.productId);
        return {
          ...item.toObject(),
          product: product ? {
            name: product.name,
            code: product.code
          } : null
        };
      }));
      
      return {
        ...order.toObject(),
        items
      };
    }));
    
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search orders by patient name
router.get('/search/patient', auth, async (req, res) => {
  try {
    const searchTerm = req.query.name;
    
    if (!searchTerm) {
      return res.status(400).json({ message: 'Patient name is required' });
    }
    
    // Admin can search all orders, clinic can only search their own
    const filter = {
      patientName: { $regex: searchTerm, $options: 'i' }
    };
    
    // If clinic user, only show their orders. For admin, filter by clinicId if provided
    if (req.user.role !== 'admin') {
      filter.clinicId = req.user.clinicId;
    } else if (req.query.clinicId) {
      filter.clinicId = req.query.clinicId;
    }
    
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .populate('clinicId', 'name');
    
    const result = await Promise.all(orders.map(async (order) => {
      // Populate items with product details
      const items = await Promise.all(order.items.map(async (item) => {
        const product = await Product.findById(item.productId);
        return {
          ...item.toObject(),
          product: product ? {
            name: product.name,
            code: product.code
          } : null
        };
      }));
      
      return {
        ...order.toObject(),
        items
      };
    }));
    
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search orders by orderNumber (partial match)
router.get('/search', auth, async (req, res) => {
  try {
    const searchTerm = req.query.term;
    
    if (!searchTerm) {
      return res.status(400).json({ message: 'Search term is required' });
    }
    
    // Admin can search all orders, clinic can only search their own
    const filter = {
      orderNumber: { $regex: searchTerm, $options: 'i' }
    };
    
    if (req.user.role !== 'admin') {
      filter.clinicId = req.user.clinicId;
    }
    
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .populate('clinicId', 'name');
    
    const result = await Promise.all(orders.map(async (order) => {
      // Populate items with product details
      const items = await Promise.all(order.items.map(async (item) => {
        const product = await Product.findById(item.productId);
        return {
          ...item.toObject(),
          product: product ? {
            name: product.name,
            code: product.code
          } : null
        };
      }));
      
      return {
        ...order.toObject(),
        items
      };
    }));
    
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('clinicId', 'name');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user has access to this order
    if (req.user.role !== 'admin' && order.clinicId._id.toString() !== req.user.clinicId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Populate items with product details
    const items = await Promise.all(order.items.map(async (item) => {
      const product = await Product.findById(item.productId);
      return {
        ...item.toObject(),
        product: product ? {
          name: product.name,
          code: product.code
        } : null
      };
    }));
    
    const result = {
      ...order.toObject(),
      items
    };
    
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create order
router.post('/', auth, async (req, res) => {
  try {
    console.log('Создание заказа. Получены данные:', req.body);
    console.log('Пользователь:', req.user);
    
    const { items, notes, patientName, deadline } = req.body;
    
    if (!items || !items.length) {
      console.log('Ошибка: Заказ должен содержать хотя бы один товар');
      return res.status(400).json({ message: 'Заказ должен содержать хотя бы один товар' });
    }
    
    if (!patientName) {
      console.log('Ошибка: Имя пациента обязательно');
      return res.status(400).json({ message: 'Имя пациента обязательно' });
    }
    
    if (!deadline) {
      console.log('Ошибка: Срок сдачи обязателен');
      return res.status(400).json({ message: 'Срок сдачи обязателен' });
    }
    
    // Calculate total and validate items
    let totalAmount = 0;
    const orderItems = [];
    
    const clinicId = req.user.clinicId;
    console.log('ID клиники:', clinicId);
    
    if (!clinicId) {
      console.log('Ошибка: ID клиники не найден в данных пользователя');
      return res.status(400).json({ message: 'ID клиники не найден в данных пользователя' });
    }
    
    // Get all prices for this clinic
    const prices = await Price.find({ clinicId });
    console.log(`Найдено ${prices.length} ценовых позиций для клиники`);
    
    for (const item of items) {
      const { productId, quantity, color } = item;
      
      if (!productId || !quantity || quantity < 1) {
        console.log('Ошибка: Неверные данные товара', item);
        return res.status(400).json({ message: 'Неверные данные товара' });
      }
      
      console.log(`Поиск цены для товара ${productId}`);
      
      // Find product price for this clinic
      const priceEntry = prices.find(p => p.productId.toString() === productId);
      
      if (!priceEntry) {
        console.log(`Ошибка: Цена не установлена для товара ${productId}`);
        return res.status(400).json({ message: `Цена не установлена для товара ${productId}` });
      }
      
      const itemTotal = priceEntry.price * quantity;
      totalAmount += itemTotal;
      
      orderItems.push({
        productId,
        quantity,
        price: priceEntry.price,
        color: color || ''
      });
    }
    
    console.log('Создаем заказ с элементами:', orderItems);
    console.log('Общая сумма:', totalAmount);
    
    const order = new Order({
      clinicId,
      patientName,
      deadline: new Date(deadline),
      items: orderItems,
      totalAmount,
      notes: notes || ''
    });
    
    const savedOrder = await order.save();
    console.log('Заказ успешно создан:', savedOrder._id);
    
    res.json(savedOrder);
  } catch (err) {
    console.error('Ошибка при создании заказа:', err);
    
    // Проверка на ошибки MongoDB
    if (err.name === 'ValidationError') {
      console.error('Ошибка валидации:', err.errors);
      return res.status(400).json({ message: 'Ошибка валидации: ' + Object.values(err.errors).map(e => e.message).join(', ') });
    }
    
    if (err.code === 11000) {
      console.error('Ошибка дублирования:', err);
      return res.status(400).json({ message: 'Дублирование уникального значения' });
    }
    
    res.status(500).json({ message: 'Ошибка сервера: ' + err.message });
  }
});

// Update order status (set to paid - admin only)
router.post('/:id/pay', [auth, admin], async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.status === 'paid') {
      return res.status(400).json({ message: 'Order is already paid' });
    }
    
    order.status = 'paid';
    order.paymentDate = new Date();
    
    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel order
router.post('/:id/cancel', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user has access to this order
    if (req.user.role !== 'admin' && order.clinicId.toString() !== req.user.clinicId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    if (order.status === 'paid') {
      return res.status(400).json({ message: 'Paid orders cannot be cancelled' });
    }
    
    order.status = 'cancelled';
    
    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 