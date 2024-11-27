require('dotenv').config();
const IP_API_URL = process.env.IP_API_URL;
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(`mongodb://${IP_API_URL}/transactions`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
