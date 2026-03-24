// src/db.js 
const mongoose = require('mongoose'); 

const connectDB = async () => { 
    try { 
        // Yahan 'stock_details' aapke database ka naam hai 
        await mongoose.connect(process.env.MONGODB_URL); 
        console.log('MongoDB connected successfully!'); 
    } catch (err) { 
        console.error('MongoDB connection failed:', err.message); 
        process.exit(1); 
    } 
}; 

module.exports = connectDB;