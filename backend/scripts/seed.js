import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { usermodel as User } from '../src/DB/model/user.model.js';
import Product from '../src/DB/model/products.schema.js';
import Order from '../src/DB/model/orders.schema.js';

dotenv.config();

const DB_URI = process.env.DB_URI || 'mongodb://127.0.0.1:27017/edtechplatform';
const SALT = Number(process.env.SALT) || 8;

const seed = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(DB_URI);
    console.log('DB Connected.');

    // Clear existing data
    console.log('Clearing old data...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});

    // Create users
    console.log('Creating users...');
    const hashedAdminPassword = await bcrypt.hash('admin123', SALT);
    const hashedUserPassword = await bcrypt.hash('user123', SALT);

    const users = await User.insertMany([
      {
        username: 'Admin User',
        email: 'admin@fabpak.com',
        password: hashedAdminPassword,
        role: 'admin',
        confirmEmail: true
      },
      {
        username: 'John Doe',
        email: 'john@example.com',
        password: hashedUserPassword,
        role: 'user',
        confirmEmail: true
      }
    ]);

    // Create products
    console.log('Creating products...');
    const products = await Product.insertMany([
      {
        productName: 'Full-Stack Web Boot Camp',
        description: 'Complete guide from HTML to Advanced Backend logic.',
        price: 1500,
        discount: 10,
        category: 'Development',
        stock: 50,
        images: ['/assets/images/placeholder.jpg'],
        tutorials: [
          { title: 'Intro to React', videoUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ', duration: 45 },
          { title: 'Designing with CSS Grid', videoUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ', duration: 30 }
        ],
        challenges: [
          { question: 'What is a closure in JS?', correctAnswer: 'A function with its lexical scope.' },
          { question: 'What does CSS stand for?', correctAnswer: 'Cascading Style Sheets.' }
        ]
      },
      {
        productName: 'Mastering Angular Components',
        description: 'Deep dive into signals, standalone components, and modern patterns.',
        price: 1200,
        discount: 0,
        category: 'Frameworks',
        stock: 30,
        images: ['/assets/images/placeholder.jpg'],
        tutorials: [
          { title: 'Standalone Components', videoUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ', duration: 25 }
        ],
        challenges: [
          { question: 'Is Angular a framework?', correctAnswer: 'Yes' }
        ]
      },
      {
        productName: 'Cybersecurity for Professionals',
        description: 'Learn ethical hacking and network protection.',
        price: 2000,
        discount: 15,
        category: 'Security',
        stock: 20,
        images: ['/assets/images/placeholder.jpg'],
        tutorials: [
          { title: 'SQL Injection Basics', videoUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ', duration: 60 }
        ],
        challenges: [
          { question: 'What is CSRF?', correctAnswer: 'Cross Site Request Forgery.' }
        ]
      }
    ]);

    // Create a delivered order for John Doe to test Dashboard/Tutorials access
    console.log('Creating delivered order...');
    await Order.create({
      user: users[1]._id,
      products: [
        { product: products[0]._id, quantity: 1, price: 1350 }
      ],
      totalPrice: 1350,
      subtotal: 1350,
      address: {
        street: '123 Tech Avenue',
        city: 'Silicon Valley',
        country: 'USA',
        phone: '01234567890'
      },
      paymentMethod: 'card',
      status: 'delivered',
      isPaid: true
    });

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seed();
