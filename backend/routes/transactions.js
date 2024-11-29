const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

router.get("/", async (req, res) => {
  try {
    const { Family_ID } = req.query;
    const familyTransactions = await Transaction.find({ Family_ID });
    // console.log(familyTransactions)
    res.json(familyTransactions);
  } catch (error) {
    res.status(500).json({ error: "Error fetching family transactions" });
  }
});

router.get("/f-details/:familyId", async (req, res) => {
  try {
    const { familyId } = req.params;
    console.log(`Fetching family details for Family_ID: ${familyId}`);

    const members = await Transaction.findOne(
      { Family_ID: familyId },
      { 
        Income: 1, 
        Savings: 1, 
        Monthly_Expenses: 1, 
        Loan_Payments: 1, 
        Credit_Card_Spending: 1, 
        Dependents: 1, 
        Financial_Goals_Met: 1, 
      }
    );
    console.log("Family Details:", members);
    res.json(members);
  } catch (error) {
    console.error("Error fetching family details:", error);
    res.status(500).json({ error: "Error fetching family details" });
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

router.get("/member-ids/:familyId", async (req, res) => {
  const { familyId } = req.params;
  console.log(`Fetching Member_IDs for Family_ID: ${familyId}`);

  // Validate Family_ID
  if (!familyId) {
    return res.status(400).json({ error: "Family_ID is required" });
  }

  try {
    // Fetch Member_IDs for the given Family_ID
    const members = await Transaction.find(
      { Family_ID: familyId },
      { Member_ID: 1, _id: 0 }
    );

    if (members.length === 0) {
      console.log("No members found");
    }
    // Extract unique Member_IDs
    const uniqueMemberIds = [...new Set(members.map((doc) => doc.Member_ID))];
    res.json(uniqueMemberIds);
  } catch (error) {
    console.error("Error fetching Member IDs:", error);
    res.status(500).json({ error: "Internal server error" });
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

    // Validate required fields
    if (!Family_ID || !Member_ID || !Transaction_Date || !Category || !Amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }
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
    console.error("Error adding transaction:", error.message);
    res.status(400).json({ error: "Error adding transaction" });
  }
});

module.exports = router;
