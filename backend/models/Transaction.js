const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  Family_ID: { type: String, required: true },
  Member_ID: { type: String, required: true },
  Transaction_Date: { type: String, required: true }, 
  Category: { type: String, required: true },
  Amount: { type: Number, required: true },
  Income: { type: Number, required: true }, 
  Savings: { type: Number, required: true }, 
  Monthly_Expenses: { type: Number, required: true }, 
  Loan_Payments: { type: Number, required: true }, 
  Credit_Card_Spending: { type: Number, required: true }, 
  Dependents: { type: Number, required: true }, 
  Financial_Goals_Met: { type: Number, required: true }, 
});

module.exports = mongoose.model('Transaction', transactionSchema);
