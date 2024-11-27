import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';
import { IP_API_URL } from '@env';

export default function AddTransaction({ navigation }) {
  const [familyID, setFamilyID] = useState('');
  const [memberID, setMemberID] = useState('');
  const [transactionDate, setTransactionDate] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [income, setIncome] = useState('');
  const [savings, setSavings] = useState('');
  const [monthlyExpenses, setMonthlyExpenses] = useState('');
  const [loanPayments, setLoanPayments] = useState('');
  const [creditCardSpending, setCreditCardSpending] = useState('');
  const [dependents, setDependents] = useState('');
  const [financialGoalsMet, setFinancialGoalsMet] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddTransaction = () => {
    if (!familyID || !memberID || !transactionDate || !category || !amount || !income || !savings || !monthlyExpenses || !loanPayments || !creditCardSpending || !dependents || !financialGoalsMet) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (isNaN(parseFloat(amount)) || isNaN(parseFloat(income)) || isNaN(parseFloat(savings)) || isNaN(parseFloat(monthlyExpenses)) || isNaN(parseFloat(loanPayments)) || isNaN(parseFloat(creditCardSpending)) || isNaN(parseInt(dependents)) || isNaN(parseInt(financialGoalsMet))) {
      Alert.alert('Error', 'Please enter valid numbers for numeric fields');
      return;
    }

    setIsLoading(true);

    const transactionData = {
      familyID,
      memberID,
      transactionDate,
      category,
      amount: parseFloat(amount),
      income: parseFloat(income),
      savings: parseFloat(savings),
      monthlyExpenses: parseFloat(monthlyExpenses),
      loanPayments: parseFloat(loanPayments),
      creditCardSpending: parseFloat(creditCardSpending),
      dependents: parseInt(dependents),
      financialGoalsMet: parseInt(financialGoalsMet),
    };

    axios
      .post(`http://${IP_API_URL}:5000/api/transactions`, transactionData)
      .then(() => {
        Alert.alert('Success', 'Transaction added successfully');
        // Clear all inputs
        setFamilyID('');
        setMemberID('');
        setTransactionDate('');
        setCategory('');
        setAmount('');
        setIncome('');
        setSavings('');
        setMonthlyExpenses('');
        setLoanPayments('');
        setCreditCardSpending('');
        setDependents('');
        setFinancialGoalsMet('');
        navigation.goBack();
      })
      .catch((error) => {
        const message = error.response?.data?.message || 'Failed to add transaction';
        Alert.alert('Error', message);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput style={styles.input} placeholder="Family ID" value={familyID} onChangeText={setFamilyID} />
      <TextInput style={styles.input} placeholder="Member ID" value={memberID} onChangeText={setMemberID} />
      <TextInput style={styles.input} placeholder="Transaction Date (e.g., 07-10-2024)" value={transactionDate} onChangeText={setTransactionDate} />
      <TextInput style={styles.input} placeholder="Category" value={category} onChangeText={setCategory} />
      <TextInput style={styles.input} placeholder="Amount" keyboardType="numeric" value={amount} onChangeText={setAmount} />
      <TextInput style={styles.input} placeholder="Income" keyboardType="numeric" value={income} onChangeText={setIncome} />
      <TextInput style={styles.input} placeholder="Savings" keyboardType="numeric" value={savings} onChangeText={setSavings} />
      <TextInput style={styles.input} placeholder="Monthly Expenses" keyboardType="numeric" value={monthlyExpenses} onChangeText={setMonthlyExpenses} />
      <TextInput style={styles.input} placeholder="Loan Payments" keyboardType="numeric" value={loanPayments} onChangeText={setLoanPayments} />
      <TextInput style={styles.input} placeholder="Credit Card Spending" keyboardType="numeric" value={creditCardSpending} onChangeText={setCreditCardSpending} />
      <TextInput style={styles.input} placeholder="Dependents" keyboardType="numeric" value={dependents} onChangeText={setDependents} />
      <TextInput style={styles.input} placeholder="Financial Goals Met (%)" keyboardType="numeric" value={financialGoalsMet} onChangeText={setFinancialGoalsMet} />
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Add Transaction" onPress={handleAddTransaction} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});