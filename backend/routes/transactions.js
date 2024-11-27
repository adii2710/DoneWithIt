const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

router.get("/", async (req, res) => {
  try {
    const { Family_ID } = req.query;
    const familyTransactions = await Transaction.find({ Family_ID });
    console.log(familyTransactions)
    res.json(familyTransactions);
  } catch (error) {
    res.status(500).json({ error: "Error fetching family transactions" });
  }
});

// Get all Family_IDs
router.get("/family-ids", async (req, res) => {
  try {
    // Fetch only the Family_ID field from all documents
    const familyIds = await Transaction.find({}, { Family_ID: 1, _id: 0 });

    const uniqueFamilyIdValues = [...new Set(familyIds.map((doc) => doc.Family_ID))];
    res.json(uniqueFamilyIdValues);
  } catch (error) {
    res.status(500).json({ error: "Error fetching Family_IDs" });
  }
});

// Add a new transaction
router.post("/", async (req, res) => {
  try {
    const {
      Family_ID,
      Member_ID,
      Transaction_Date,
      Category,
      Amount,
      Income,
      Savings,
      Monthly_Expenses,
      Loan_Payments,
      Credit_Card_Spending,
      Dependents,
      Financial_Goals_Met,
    } = req.body;
    console.log('Request received:', req.body); // Logs request data

    // Validate required fields
    // if (!familyID || !memberID || !transactionDate || !category || !amount) {
    //   return res.status(400).json({ error: "Missing required fields" });
    // }

    const newTransaction = new Transaction({
      Family_ID,
      Member_ID,
      Transaction_Date,
      Category,
      Amount,
      Income,
      Savings,
      Monthly_Expenses,
      Loan_Payments,
      Credit_Card_Spending,
      Dependents,
      Financial_Goals_Met,
    });

    await newTransaction.save();
    res.json(newTransaction);
  } catch (error) {
    console.error("Error adding transaction:", error);
    res.status(400).json({ error: "Error adding transaction" });
  }
});

module.exports = router;
