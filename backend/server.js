const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./database/connection');
const transactionsRoute = require('./routes/transactions');
const app = express();
const PORT = 5000;
require('dotenv').config();
const IP_API_URL = process.env.IP_API_URL;

// Middleware
app.use(cors());
app.use(bodyParser.json());

connectDB();

app.use('/api/transactions', transactionsRoute);

app.listen(PORT, () => {
  console.log(`Server running on http://${IP_API_URL}:${PORT}`);
});
