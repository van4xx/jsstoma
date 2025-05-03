# Data Import Scripts

This directory contains scripts for importing data into the application.

## Seed Data Script

The `seedData.js` script imports clinic and pricing data into the database. It will:

1. Create an admin user with username `admin` and password `admin123`
2. Create all the clinics from the provided data
3. Create user accounts for each clinic
4. Create all the products
5. Set the appropriate prices for each clinic's products

### How to Run

1. Make sure MongoDB is running
2. Create a `.env` file in the server root directory with MongoDB connection settings
3. Run the seed script:

```bash
# From the server directory:
npm run seed
```

### What Data is Imported

- 11 clinics with their logins and passwords
- 30 dental products/services
- Pricing for all products for each clinic
- An admin user account

### Notes

- The script is safe to run multiple times - it will check if entities already exist before creating them
- If you need to update existing data, modify the arrays in the script 