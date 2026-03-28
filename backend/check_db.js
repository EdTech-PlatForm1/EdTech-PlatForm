import mongoose from 'mongoose';
import Product from './src/DB/model/products.schema.js';
import dotenv from 'dotenv';
dotenv.config();

async function checkDB() {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log('Connected to MongoDB');
    const count = await Product.countDocuments();
    console.log(`Product count in DB: ${count}`);
    const products = await Product.find({ isDeleted: false });
    console.log(`Active product count: ${products.length}`);
    if (products.length > 0) {
        console.log('First product sample:', products[0].productName);
    }
    await mongoose.connection.close();
  } catch (err) {
    console.error('Connection error:', err);
  }
}

checkDB();
