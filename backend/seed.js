import dbconnection from './src/DB/db.connection.js';
import { usermodel as User } from './src/DB/model/user.model.js';
import { productschema as ProductSchema } from './src/DB/model/products.schema.js';
import { orderschema as OrderSchema } from './src/DB/model/orders.schema.js';
import mongoose from 'mongoose';

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

const seedData = async () => {
  try {
    await dbconnection();

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});

    // Create sample users
    const users = await User.insertMany([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: '$2a$10$hashedpassword', // Use bcrypt to hash
        role: 'user'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: '$2a$10$hashedpassword',
        role: 'user'
      }
    ]);

    // Create sample products
    const products = await Product.insertMany([
      {
        name: 'Complete Web Development Course',
        price: 99.99,
        description: 'Learn full-stack web development from scratch',
        images: ['/uploads/web-dev.jpg'],
        tutorials: [
          {
            title: 'Introduction to HTML',
            description: 'Learn the basics of HTML'
          },
          {
            title: 'CSS Fundamentals',
            description: 'Styling your web pages'
          }
        ],
        challenges: [
          {
            title: 'Build a Portfolio Website',
            description: 'Create your first portfolio'
          }
        ]
      },
      {
        name: 'React Masterclass',
        price: 79.99,
        description: 'Master React.js development',
        images: ['/uploads/react.jpg'],
        tutorials: [
          {
            title: 'React Components',
            description: 'Understanding components'
          }
        ],
        challenges: [
          {
            title: 'Build a Todo App',
            description: 'Create a functional todo application'
          }
        ]
      },
      {
        name: 'Python for Data Science',
        price: 89.99,
        description: 'Learn Python programming for data analysis',
        images: ['/uploads/python.jpg'],
        tutorials: [
          {
            title: 'Python Basics',
            description: 'Getting started with Python'
          }
        ],
        challenges: [
          {
            title: 'Data Analysis Project',
            description: 'Analyze real datasets'
          }
        ]
      }
    ]);

    // Create sample orders
    await Order.insertMany([
      {
        userId: users[0]._id,
        products: [
          {
            productId: products[0]._id,
            quantity: 1,
            price: products[0].price
          }
        ],
        totalAmount: products[0].price,
        address: '123 Main St, City, Country',
        phone: '1234567890',
        paymentMethod: 'credit_card',
        status: 'delivered'
      },
      {
        userId: users[1]._id,
        products: [
          {
            productId: products[1]._id,
            quantity: 1,
            price: products[1].price
          }
        ],
        totalAmount: products[1].price,
        address: '456 Oak Ave, City, Country',
        phone: '0987654321',
        paymentMethod: 'paypal',
        status: 'pending'
      }
    ]);

    console.log('Mock data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();