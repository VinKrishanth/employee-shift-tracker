import mongoose from 'mongoose';
import Employee from '../models/Employee.js';
import 'dotenv/config';
import connectDB from '../configs/dbConfig.js'; 

const ADMIN_NAME = process.env.ADMIN_NAME 
const ADMIN_EMAIL = process.env.ADMIN_EMAIL 
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD  

const createAdmin = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('Error: MONGODB_URI is not defined in .env file.');
      process.exit(1);
    }

    await connectDB();
    
    // Check if an admin Employee already exists
    const existingAdmin = await Employee.findOne({ email: ADMIN_EMAIL, role: 'admin' });
    if (existingAdmin) {
      console.log(`Admin with email ${ADMIN_EMAIL} already exists:`, existingAdmin);
      process.exit(0); 
    }

    const admin = await Employee.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD, 
      role: 'admin',
    });

    console.log('Admin created:', admin);
  } catch (error) {
    console.error('[Error creating admin]:', error.message);
  } finally {
    await mongoose.connection.close(); 
    console.log('MongoDB connection closed');
    process.exit(); 
  }
};

createAdmin();
