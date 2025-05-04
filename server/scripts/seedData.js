require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Clinic = require('../models/Clinic');
const Product = require('../models/Product');
const Price = require('../models/Price');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected for seeding'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Clinic login data
const clinicData = [
  { log: 'Albadent', pass: 'Albadent', id: 1 },
  { log: '32dent', pass: '32dent', id: 2   },
  { log: 'dentateka', pass: 'dentateka', id: 3 },
  { log: 'adam', pass: 'adam', id: 4 },
  { log: 'diamant', pass: 'diamant', id: 5 },
  { log: 'hudoyanSS', pass: 'hudoyanSS', id: 6 },
  { log: 'seyran', pass: 'seyran', id: 7 },
  { log: 'AlbertN', pass: 'AlbertN', id: 8 },
  { log: 'Esma', pass: 'Esma', id: 9 },
  { log: 'kimleonid', pass: 'kimleonid', id: 10 },
  { log: 'modeliane', pass: 'modeliane', id: 11 }
];

// Products data (unique product names from price list)
const productNames = [
  'Изготовление металлокерамической коронки',
  'Изготовление коронки  с опорой на имплант на винтовой фиксации(+основание)',
  'Изготовление коронки  с опорой на имплант на винтовой фиксации(-основание)',
  'Изготовление цельнометаллической коронки',
  'Изготовление коронки на основе диоксида циркония Полная анатомия',
  'Изготовление коронки на основе диоксида циркония Метод нанесения',
  'Изготовление влкадки-накладки (Емах ) метод окрашивания',
  'Изготовление индивидуального титанового абамента',
  'Изготовление индивидуального циркониевого абатмента',
  'Изготовление пластмассовой коронки метод(CAD/CAM PMMA)',
  'Изготовление пластмассовой коронки на имплант.метод(CAD/CAM PMMA)',
  'Изготовление металлической культевой вкладки',
  'Отливка металлической культевой вкладки',
  'Wax-Up – 1 зуб',
  'Изготовление диагностических моделей(одна челюсть)',
  'Изготовление каппы (1 челюсть)',
  'Гипсовка диагностических моделей в артикулятор',
  'Изготовление замкового бюгельного протеза',
  'Изготовление кламмерного бюгельного протеза',
  'Нейлон бабочка',
  'Акрил бабочка',
  'Акриловый протез',
  'Нейлоновый протез',
  'Перебазировка протеза',
  'Починка протеза',
  'Приварка зуба',
  'Изготовление работы на всё на 6',
  'Изготовление работы всё на 4',
  'Изготовление пластмассовой конструкции всё на 6',
  'Изготовление пластмассовой конструкции всё на 4'
];

const standardPricing = [
  { name: 'Изготовление металлокерамической коронки', price: 2500 },
  { name: 'Изготовление коронки  с опорой на имплант на винтовой фиксации(+основание)', price: 5000 },
  { name: 'Изготовление коронки  с опорой на имплант на винтовой фиксации(-основание)', price: 4500 },
  { name: 'Изготовление цельнометаллической коронки', price: 1000 },
  { name: 'Изготовление коронки на основе диоксида циркония Полная анатомия', price: 4000 },
  { name: 'Изготовление коронки на основе диоксида циркония Метод нанесения', price: 6500 },
  { name: 'Изготовление влкадки-накладки (Емах ) метод окрашивания', price: 5000 },
  { name: 'Изготовление индивидуального титанового абамента', price: 2500 },
  { name: 'Изготовление индивидуального циркониевого абатмента', price: 2500 },
  { name: 'Изготовление пластмассовой коронки метод(CAD/CAM PMMA)', price: 1000 },
  { name: 'Изготовление пластмассовой коронки на имплант.метод(CAD/CAM PMMA)', price: 2500 },
  { name: 'Изготовление металлической культевой вкладки', price: 1000 },
  { name: 'Отливка металлической культевой вкладки', price: 300 },
  { name: 'Wax-Up – 1 зуб', price: 200 },
  { name: 'Изготовление диагностических моделей(одна челюсть)', price: 200 },
  { name: 'Изготовление каппы (1 челюсть)', price: 1000 },
  { name: 'Гипсовка диагностических моделей в артикулятор', price: 200 },
  { name: 'Изготовление замкового бюгельного протеза', price: 25000 },
  { name: 'Изготовление кламмерного бюгельного протеза', price: 20000 },
  { name: 'Нейлон бабочка', price: 5000 },
  { name: 'Акрил бабочка', price: 3000 },
  { name: 'Акриловый протез', price: 9000 },
  { name: 'Нейлоновый протез', price: 13000 },
  { name: 'Перебазировка протеза', price: 3000 },
  { name: 'Починка протеза', price: 1500 },
  { name: 'Приварка зуба', price: 1000 },
  { name: 'Изготовление работы на всё на 6', price: 92000 },
  { name: 'Изготовление работы всё на 4', price: 82000 },
  { name: 'Изготовление пластмассовой конструкции всё на 6', price: 15000 },
  { name: 'Изготовление пластмассовой конструкции всё на 4', price: 13000 }
];

// Pricing data - structured as clinicId => [{ productName, price }]
const pricingData = {
  1: [...standardPricing],
  2: [...standardPricing],
  3: [...standardPricing],
  4: [...standardPricing],
  5: [...standardPricing],
  6: [...standardPricing],
  7: [...standardPricing],
  8: [...standardPricing],
  9: [...standardPricing],
  10: [...standardPricing],
  11: [...standardPricing]
};

// Добавим особые цены для Albadent (id 1)
pricingData[1] = [
  { name: 'Изготовление металлокерамической коронки', price: 3000 },
  { name: 'Изготовление коронки  с опорой на имплант на винтовой фиксации(+основание)', price: 6500 },
  { name: 'Изготовление коронки  с опорой на имплант на винтовой фиксации(-основание)', price: 6000 },
  { name: 'Изготовление цельнометаллической коронки', price: 1000 },
  { name: 'Изготовление коронки на основе диоксида циркония Полная анатомия', price: 4500 },
  { name: 'Изготовление коронки на основе диоксида циркония Метод нанесения', price: 6500 },
  { name: 'Изготовление влкадки-накладки (Емах ) метод окрашивания', price: 5000 },
  { name: 'Изготовление индивидуального титанового абамента', price: 2500 },
  { name: 'Изготовление индивидуального циркониевого абатмента', price: 2500 },
  { name: 'Изготовление пластмассовой коронки метод(CAD/CAM PMMA)', price: 1000 },
  { name: 'Изготовление пластмассовой коронки на имплант.метод(CAD/CAM PMMA)', price: 2500 },
  { name: 'Изготовление металлической культевой вкладки', price: 900 },
  { name: 'Отливка металлической культевой вкладки', price: 300 },
  { name: 'Wax-Up – 1 зуб', price: 200 },
  { name: 'Изготовление диагностических моделей(одна челюсть)', price: 200 },
  { name: 'Изготовление каппы (1 челюсть)', price: 1000 },
  { name: 'Гипсовка диагностических моделей в артикулятор', price: 200 },
  { name: 'Изготовление замкового бюгельного протеза', price: 25000 },
  { name: 'Изготовление кламмерного бюгельного протеза', price: 20000 },
  { name: 'Нейлон бабочка', price: 5000 },
  { name: 'Акрил бабочка', price: 3000 },
  { name: 'Акриловый протез', price: 9000 },
  { name: 'Нейлоновый протез', price: 13000 },
  { name: 'Перебазировка протеза', price: 3000 },
  { name: 'Починка протеза', price: 1500 },
  { name: 'Приварка зуба', price: 1000 },
  { name: 'Изготовление работы на всё на 6', price: 92000 },
  { name: 'Изготовление работы всё на 4', price: 82000 },
  { name: 'Изготовление пластмассовой конструкции всё на 6', price: 15000 },
  { name: 'Изготовление пластмассовой конструкции всё на 4', price: 13000 }
];

// Add standard pricing for all other clinics
clinicData.forEach(clinic => {
  if (clinic.id !== 1) { // All clinics except Albadent
    pricingData[clinic.id] = [...standardPricing];
  }
});

// Create admin user
const createAdminUser = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const admin = new User({
      username: 'Root',
      password: 'Root1234root', // Will be hashed by the pre-save hook
      role: 'admin'
    });

    await admin.save();
    console.log('Admin user created successfully');
  } catch (err) {
    console.error('Error creating admin user:', err);
  }
};

// Create clinics and users
const createClinicsAndUsers = async () => {
  try {
    for (const clinicInfo of clinicData) {
      // Check if clinic already exists
      let clinic = await Clinic.findOne({ name: clinicInfo.log });
      
      if (!clinic) {
        // Create clinic
        clinic = new Clinic({
          name: clinicInfo.log,
          contact: {
            phone: '',
            email: ''
          }
        });
        
        await clinic.save();
        console.log(`Clinic ${clinicInfo.log} created successfully`);
      }

      // Check if user already exists
      const existingUser = await User.findOne({ username: clinicInfo.log });
      
      if (!existingUser) {
        // Create user for this clinic
        const user = new User({
          username: clinicInfo.log,
          password: clinicInfo.pass, // Will be hashed by the pre-save hook
          role: 'clinic',
          clinicId: clinic._id
        });
        
        await user.save();
        console.log(`User for clinic ${clinicInfo.log} created successfully`);
      }
    }
  } catch (err) {
    console.error('Error creating clinics and users:', err);
  }
};

// Create products
const createProducts = async () => {
  try {
    for (const productName of productNames) {
      // Check if product already exists
      const existingProduct = await Product.findOne({ name: productName });
      
      if (!existingProduct) {
        // Create product
        const product = new Product({
          name: productName,
          active: true
        });
        
        await product.save();
        console.log(`Product "${productName}" created successfully`);
      }
    }
  } catch (err) {
    console.error('Error creating products:', err);
  }
};

// Set prices for each clinic
const setPrices = async () => {
  try {
    // Get all clinics and products
    const clinics = await Clinic.find();
    const products = await Product.find();
    
    // Create a map of product names to IDs
    const productMap = {};
    products.forEach(product => {
      productMap[product.name] = product._id;
    });
    
    // Create a map of clinic names to IDs
    const clinicMap = {};
    clinics.forEach(clinic => {
      clinicMap[clinic.name] = clinic._id;
    });
    
    // Set prices for each clinic
    for (const clinicInfo of clinicData) {
      const clinicId = clinicMap[clinicInfo.log];
      const pricesForClinic = pricingData[clinicInfo.id];
      
      if (!clinicId) {
        console.error(`Clinic ID not found for ${clinicInfo.log}`);
        continue;
      }
      
      for (const priceInfo of pricesForClinic) {
        const productId = productMap[priceInfo.name];
        
        if (!productId) {
          console.error(`Product ID not found for "${priceInfo.name}"`);
          continue;
        }
        
        // Check if price already exists
        let price = await Price.findOne({ clinicId, productId });
        
        if (price) {
          // Update existing price
          price.price = priceInfo.price;
          await price.save();
          console.log(`Price updated for ${priceInfo.name} (${clinicInfo.log}): ${priceInfo.price}`);
        } else {
          // Create new price
          price = new Price({
            clinicId,
            productId,
            price: priceInfo.price
          });
          
          await price.save();
          console.log(`Price set for ${priceInfo.name} (${clinicInfo.log}): ${priceInfo.price}`);
        }
      }
    }
  } catch (err) {
    console.error('Error setting prices:', err);
  }
};

// Run the seeding process
const seedDatabase = async () => {
  try {
    await createAdminUser();
    await createClinicsAndUsers();
    await createProducts();
    await setPrices();
    
    console.log('Database seeding completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

// Start the seeding process
seedDatabase(); 