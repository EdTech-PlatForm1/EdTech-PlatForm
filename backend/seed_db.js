import mongoose from 'mongoose';
import Product from './src/DB/model/products.schema.js';
import dotenv from 'dotenv';
dotenv.config();

async function seedDB() {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log('Connected to MongoDB');
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('Inserting mock products...');
      await Product.insertMany([
        {
          productName: 'EdTech Kit - Level 1',
          description: 'A beginner building set for learning basics of physics and mechanics.',
          price: 49.99,
          category: 'Robotics',
          stock: 100,
          images: [],
          tutorials: [{ title: 'Intro to EdTech', videoUrl: 'https://youtube.com', duration: 15 }]
        },
        {
          productName: 'Smart Car Kit',
          description: 'Build your own programmable self-driving car.',
          price: 129.99,
          category: 'Arduino',
          stock: 50,
          images: [],
          tutorials: [{ title: 'Assembly Part 1', videoUrl: 'https://youtube.com', duration: 45 }]
        }
      ]);
      console.log('Mock products inserted successfully!');
    } else {
      console.log(`DB already has ${count} products.`);
    }
    await mongoose.connection.close();
  } catch (err) {
    console.error('Error:', err);
  }
}

seedDB();
