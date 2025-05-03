# Clinic Pricing and Order Management API

Backend API for a clinic pricing and order management system.

## Features

- Authentication and authorization for clinics and admin
- Product management
- Clinic-specific pricing
- Order creation and management
- Payment processing for orders

## Installation

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/clinic-pricing
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=7d
   ```

3. Start the server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with username and password
- `GET /api/auth/me` - Get current user profile

### Clinics
- `GET /api/clinics` - Get all clinics (admin only)
- `GET /api/clinics/:id` - Get a single clinic
- `POST /api/clinics` - Create a new clinic (admin only)
- `PUT /api/clinics/:id` - Update a clinic (admin only)
- `POST /api/clinics/:id/user` - Create/update user for a clinic (admin only)

### Products
- `GET /api/products/all` - Get all products (admin only)
- `GET /api/products` - Get products with prices for the current clinic
- `POST /api/products` - Create a product (admin only)
- `PUT /api/products/:id` - Update a product (admin only)
- `POST /api/products/price` - Set price for a product for a specific clinic (admin only)

### Orders
- `GET /api/orders` - Get orders for the current clinic
- `GET /api/orders/unpaid` - Get unpaid orders for the current clinic
- `GET /api/orders/search` - Search orders by order number
- `GET /api/orders/:id` - Get a single order
- `POST /api/orders` - Create a new order
- `POST /api/orders/:id/pay` - Mark an order as paid (admin only)
- `POST /api/orders/:id/cancel` - Cancel an order 