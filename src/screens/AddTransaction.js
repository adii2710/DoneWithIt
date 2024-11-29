import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { IP_API_URL } from '@env';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

export default function AddTransaction({ navigation }) {
  const [availableFamilies, setAvailableFamilies] = useState([]);
  const [availableMembers, setAvailableMembers] = useState([]);
  const [isNewFamily, setIsNewFamily] = useState(false);
  const [isNewMember, setIsNewMember] = useState(false);
  const [transactionData, setTransactionData] = useState({
    Family_ID: '',
    Member_ID: '',
    Transaction_Date: new Date(),
    Category: '',
    Amount: '',
    Income: '',
    Savings: '',
    Monthly_Expenses: '',
    Loan_Payments: '',
    Credit_Card_Spending: '',
    Dependents: '',
    Financial_Goals_Met: '',
  });

  const [availableFamilies, setAvailableFamilies] = useState([]);
  const [availableMembers, setAvailableMembers] = useState([]);
  const [isNewFamily, setIsNewFamily] = useState(false);
  const [isNewMember, setIsNewMember] = useState(false);
  const [transactionData, setTransactionData] = useState({
    Family_ID: '',
    Member_ID: '',
    Transaction_Date: new Date(),
    Category: '',
    Amount: '',
    Income: '',
    Savings: '',
    Monthly_Expenses: '',
    Loan_Payments: '',
    Credit_Card_Spending: '',
    Dependents: '',
    Financial_Goals_Met: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    fetchFamilies();
  }, []);

  const fetchFamilies = async () => {
    try {
      const response = await axios.get(`http://${IP_API_URL}:5000/api/transactions/family-ids`);
      setAvailableFamilies(response.data);
    } catch (error) {
      Alert.alert('Error', 'Could not fetch families');
      console.error(error);
    }
  };

  // Fetch members for a specific family
  const fetchFamilyMembers = async (familyId) => {
    try {
      const response = await axios.get(`http://${IP_API_URL}:5000/api/transactions/member-ids/${familyId}`);
      setAvailableMembers(response.data);
    } catch (error) {
      Alert.alert('Error', 'Could not fetch family members');
      console.error(error);
    }
  };
  
  const fetchOtherDetails = async (familyId) => {
    if (!familyId) {
      console.error("Family ID is undefined!");
      return;
    }
    try {
      const response = await axios.get(`http://${IP_API_URL}:5000/api/transactions/f-details/${familyId}`);
      const { Income, Savings, Monthly_Expenses, Loan_Payments, Credit_Card_Spending, Dependents, Financial_Goals_Met } = response.data;

      setTransactionData((prevData) => ({
        ...prevData,
        Income,
        Savings,
        Monthly_Expenses,
        Loan_Payments,
        Credit_Card_Spending,
        Dependents,
        Financial_Goals_Met,
      }));
    } catch (error) {
      console.error("Error fetching member IDs:", error);
    }
    // console.log(transactionData)
    
  };

  // Generate new Family ID
  const generateNewFamilyId = async () => {
    try {
      const newFamilyId = `FAM${availableFamilies.length + 1}`;
      updateField('Family_ID', newFamilyId);
      setIsNewFamily(false);
    } catch (error) {
      Alert.alert('Error', 'Could not generate family ID');
      console.error(error);
    }
  };

  // Generate new Member ID
  const generateNewMemberId = async () => {
    try {
      if (!transactionData.Family_ID) {
        Alert.alert('Error', 'Please select a family first');
        return;
      }
      
      const newMemberId = `${transactionData.Family_ID}_Member${availableMembers.length + 1}`;
      updateField('Member_ID', newMemberId);
      setIsNewMember(false);
    } catch (error) {
      Alert.alert('Error', 'Could not generate member ID');
      console.error(error);
    }
  };

  const updateField = (field, value) => {
    setTransactionData(prev => ({ ...prev, [field]: value }));
  };

  const handleFamilySelection = (familyId) => {
    // Reset Member ID when family changes
    updateField('Family_ID', familyId);
    updateField('Member_ID', '');
    setIsNewFamily(familyId === 'new');
    
    if (familyId !== 'new' && familyId) {
      fetchFamilyMembers(familyId);
      fetchOtherDetails(familyId);
    } else {
      setAvailableMembers([]);
    }
    console.log("Rendering with transactionData:", transactionData);
  };

  const handleMemberSelection = (memberId) => {
    updateField('Member_ID', memberId);
    setIsNewMember(memberId === 'new');
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || transactionData.Transaction_Date;
    setShowDatePicker(false);
    updateField('Transaction_Date', currentDate);
  };

  const handleAddTransaction = () => {
    const numericFields = ['Amount', 'Income', 'Savings', 'Monthly_Expenses', 'Loan_Payments', 'Credit_Card_Spending', 'Dependents', 'Financial_Goals_Met'];
    
    // Validation
    const emptyFields = Object.keys(transactionData).filter(key => 
      !transactionData[key] && key !== 'Transaction_Date'
    );
    
    if (emptyFields.length > 0) {
      Alert.alert('Error', `Please fill in: ${emptyFields.join(', ')}`);
    const numericFields = ['Amount', 'Income', 'Savings', 'Monthly_Expenses', 'Loan_Payments', 'Credit_Card_Spending', 'Dependents', 'Financial_Goals_Met'];
    
    // Validation
    const emptyFields = Object.keys(transactionData).filter(key => 
      !transactionData[key] && key !== 'Transaction_Date'
    );
    
    if (emptyFields.length > 0) {
      Alert.alert('Error', `Please fill in: ${emptyFields.join(', ')}`);
      return;
    }

    // Numeric validation
    const invalidNumericFields = numericFields.filter(field => 
      isNaN(parseFloat(transactionData[field]))
    );
    
    if (invalidNumericFields.length > 0) {
      Alert.alert('Error', `Invalid numeric values for: ${invalidNumericFields.join(', ')}`);
    // Numeric validation
    const invalidNumericFields = numericFields.filter(field => 
      isNaN(parseFloat(transactionData[field]))
    );
    
    if (invalidNumericFields.length > 0) {
      Alert.alert('Error', `Invalid numeric values for: ${invalidNumericFields.join(', ')}`);
      return;
    }

    setIsLoading(true);

    const payload = {
      ...transactionData,
      Transaction_Date: transactionData.Transaction_Date.toISOString().split('T')[0],
      Amount: parseFloat(transactionData.Amount),
      Income: parseFloat(transactionData.Income),
      Savings: parseFloat(transactionData.Savings),
      Monthly_Expenses: parseFloat(transactionData.Monthly_Expenses),
      Loan_Payments: parseFloat(transactionData.Loan_Payments),
      Credit_Card_Spending: parseFloat(transactionData.Credit_Card_Spending),
      Dependents: parseInt(transactionData.Dependents),
      Financial_Goals_Met: parseInt(transactionData.Financial_Goals_Met),
    const payload = {
      ...transactionData,
      Transaction_Date: transactionData.Transaction_Date.toISOString().split('T')[0],
      Amount: parseFloat(transactionData.Amount),
      Income: parseFloat(transactionData.Income),
      Savings: parseFloat(transactionData.Savings),
      Monthly_Expenses: parseFloat(transactionData.Monthly_Expenses),
      Loan_Payments: parseFloat(transactionData.Loan_Payments),
      Credit_Card_Spending: parseFloat(transactionData.Credit_Card_Spending),
      Dependents: parseInt(transactionData.Dependents),
      Financial_Goals_Met: parseInt(transactionData.Financial_Goals_Met),
    };

    axios
      .post(`http://${IP_API_URL}:5000/api/transactions`, payload)
      .post(`http://${IP_API_URL}:5000/api/transactions`, payload)
      .then(() => {
        Alert.alert('Success', 'Transaction added successfully');
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
      <Text style={styles.header}>Add New Transaction</Text>
      
      {/* Family ID Dropdown */}
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Select Family</Text>
        <Picker
          selectedValue={transactionData.Family_ID}
          onValueChange={handleFamilySelection}
        >
          <Picker.Item label="Select Family" value="" />
          <Picker.Item label="New Family" value="new" />
          {availableFamilies.map(familyId => (
            <Picker.Item 
              key={familyId} 
              label={familyId} 
              value={familyId} 
            />
          ))}
        </Picker>
      </View>

      {/* New Family Button */}
      {isNewFamily && (
        <Button 
          title="Create New Family" 
          onPress={generateNewFamilyId} 
        />
      )}

      {/* Member ID Dropdown (only show when a family is selected) */}
      {transactionData.Family_ID && !isNewFamily && (
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Select Member</Text>
          <Picker
            selectedValue={transactionData.Member_ID}
            onValueChange={handleMemberSelection}
          >
            <Picker.Item label="Select Member" value="" />
            <Picker.Item label="New Member" value="new" />
            {availableMembers.map(memberId => (
              <Picker.Item 
                key={memberId} 
                label={memberId} 
                value={memberId} 
              />
            ))}
          </Picker>
        </View>
      )}

      {/* New Member Button */}
      {isNewMember && (
        <Button 
          title="Create New Member" 
          onPress={generateNewMemberId} 
        />
      )}
      
      {/* Date Picker */}
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
        <Text>{transactionData.Transaction_Date.toLocaleDateString()}</Text>
      </TouchableOpacity>
      
      {showDatePicker && (
        <DateTimePicker
          value={transactionData.Transaction_Date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      
      {/* Rest of the form fields */}
      <TextInput 
        style={styles.input} 
        placeholder="Category" 
        value={transactionData.Category} 
        onChangeText={(value) => updateField('Category', value)} 
      />
      
      {['Amount', 'Income', 'Savings', 'Monthly_Expenses', 
        'Loan_Payments', 'Credit_Card_Spending', 
        'Dependents', 'Financial_Goals_Met'].map(field => (
          <TextInput
            key={field}
            style={styles.input}
            placeholder={field.replace(/_/g, ' ')}
            keyboardType="numeric"
            value = {transactionData[field] ? String(transactionData[field]) : ''}
            onChangeText={(value) => updateField(field, value)}
          />
      ))}
      
      <Text style={styles.header}>Add New Transaction</Text>
      
      {/* Family ID Dropdown */}
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Select Family</Text>
        <Picker
          selectedValue={transactionData.Family_ID}
          onValueChange={handleFamilySelection}
        >
          <Picker.Item label="Select Family" value="" />
          <Picker.Item label="New Family" value="new" />
          {availableFamilies.map(familyId => (
            <Picker.Item 
              key={familyId} 
              label={familyId} 
              value={familyId} 
            />
          ))}
        </Picker>
      </View>

      {/* New Family Button */}
      {isNewFamily && (
        <Button 
          title="Create New Family" 
          onPress={generateNewFamilyId} 
        />
      )}

      {/* Member ID Dropdown (only show when a family is selected) */}
      {transactionData.Family_ID && !isNewFamily && (
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Select Member</Text>
          <Picker
            selectedValue={transactionData.Member_ID}
            onValueChange={handleMemberSelection}
          >
            <Picker.Item label="Select Member" value="" />
            <Picker.Item label="New Member" value="new" />
            {availableMembers.map(memberId => (
              <Picker.Item 
                key={memberId} 
                label={memberId} 
                value={memberId} 
              />
            ))}
          </Picker>
        </View>
      )}

      {/* New Member Button */}
      {isNewMember && (
        <Button 
          title="Create New Member" 
          onPress={generateNewMemberId} 
        />
      )}
      
      {/* Date Picker */}
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
        <Text>{transactionData.Transaction_Date.toLocaleDateString()}</Text>
      </TouchableOpacity>
      
      {showDatePicker && (
        <DateTimePicker
          value={transactionData.Transaction_Date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      
      {/* Rest of the form fields */}
      <TextInput 
        style={styles.input} 
        placeholder="Category" 
        value={transactionData.Category} 
        onChangeText={(value) => updateField('Category', value)} 
      />
      
      {['Amount', 'Income', 'Savings', 'Monthly_Expenses', 
        'Loan_Payments', 'Credit_Card_Spending', 
        'Dependents', 'Financial_Goals_Met'].map(field => (
          <TextInput
            key={field}
            style={styles.input}
            placeholder={field.replace(/_/g, ' ')}
            keyboardType="numeric"
            value = {transactionData[field] ? String(transactionData[field]) : ''}
            onChangeText={(value) => updateField(field, value)}
          />
      ))}
      
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Add Transaction" onPress={handleAddTransaction} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    padding: 20,
    paddingBottom: 100 
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  container: { 
    padding: 20,
    paddingBottom: 100 
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    height: 50,
    borderColor: '#1E6FEB',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  dateInput: {
    height: 50,
    borderColor: '#1E6FEB',
    borderWidth: 1,
    marginBottom: 15,
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  pickerContainer: {
    borderColor: '#1E6FEB',
    height: 50,
    borderColor: '#1E6FEB',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  dateInput: {
    height: 50,
    borderColor: '#1E6FEB',
    borderWidth: 1,
    marginBottom: 15,
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  pickerContainer: {
    borderColor: '#1E6FEB',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
  },
  label: {
    marginLeft: 15,
    marginTop: 10,
    fontSize: 16,
    color: '#1E6FEB',
    borderRadius: 8,
    marginBottom: 15,
  },
  label: {
    marginLeft: 15,
    marginTop: 10,
    fontSize: 16,
    color: '#1E6FEB',
  },
});