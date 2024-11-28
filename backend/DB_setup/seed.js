require("dotenv").config({path:'../.env'});
const IP_API_URL = process.env.IP_API_URL;
const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const Transaction = require('../models/Transaction'); 

console.log(IP_API_URL)

mongoose
  .connect(`mongodb://${IP_API_URL}/test`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected'))
  .catch((err) => console.error('Database connection error:', err));

const importData = async () => {
  const transactions = [];
  fs.createReadStream('family_financial_and_transactions_data.csv') 
    .pipe(csv())
    .on('data', (row) => {
      transactions.push(row);
    })
    .on('end', async () => {
      try {
        await Transaction.insertMany(transactions);
        console.log('Data successfully imported');
      } catch (error) {
        console.error('Error importing data:', error);
      } finally {
        mongoose.connection.close();
      }
    });
};

importData();
