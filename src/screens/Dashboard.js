import React, { useEffect, useState } from 'react';
import { View, Text,Button, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { IP_API_URL } from '@env';

export default function Dashboard({navigation}) {
  const [availableFamilies, setAvailableFamilies] = useState([]);
  const [selectedFamily, setSelectedFamily] = useState('');
  const [familyData, setFamilyData] = useState([]);
  const [memberContributions, setMemberContributions] = useState({});

  useEffect(() => {
    // Fetch all available families for the dropdown
    axios.get(`http://${IP_API_URL}:5000/api/transactions/family-ids`)
      .then((response) => {
        setAvailableFamilies(response.data);
      })
      .catch((error) => {
        console.error('Error fetching families:', error.response ? error.response.data : error.message);
      });
  }, []);

  const fetchFamilyData = (familyID) => {
    // Fetch data for the selected family
    axios.get(`http://${IP_API_URL}:5000/api/transactions?Family_ID=${familyID}`)
      .then((response) => {
        const data = response.data;
        setFamilyData(data);
        // const apiUrl = process.env.IP_API_URL
        // console.log(apiUrl)
        console.log(IP_API_URL)

        // Analyze member contributions
        const contributions = data.reduce((acc, curr) => {
          acc[curr.Member_ID] = (acc[curr.Member_ID] || 0) + curr.Amount;
          return acc;
        }, {});

        setMemberContributions(contributions);
        // setSavingsInsights(insights);
      })
      .catch((error) => {
        console.error('Error fetching family data:', error.response ? error.response.data : error.message);
        // Reset data on error
        setMemberContributions({});
      });
  };

  const handleFamilySelect = (familyID) => {
    setSelectedFamily(familyID);
    if (familyID) fetchFamilyData(familyID);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Family Selection Dropdown */}
      <Button title="Add Transaction" onPress={() => navigation.navigate('AddTransaction')} />
      <Text style={styles.header}>Select Family:</Text>
      <Picker
        selectedValue={selectedFamily}
        onValueChange={(itemValue) => handleFamilySelect(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select a Family" value="" />
        {availableFamilies.map((family) => (
          <Picker.Item key={family} label={family} value={family} />
        ))}
      </Picker>

      {/* Analysis Section */}
      {selectedFamily && (
        <View>
          <Text style={styles.sectionHeader}>Analysis for Family: {selectedFamily}</Text>

          {/* Member Contributions */}
          <View style={styles.section}>
            <Text style={styles.subHeader}>Member Contributions</Text>
            {Object.entries(memberContributions).map(([member, total]) => (
              <Text key={`contribution-${member}`} style={styles.item}>
                Member: {member}, Total: ${total.toFixed(2)}
              </Text>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    padding: 20,
    flex: 1 
  },
  header: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 10 
  },
  sectionHeader: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginTop: 20 
  },
  subHeader: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginBottom: 10 
  },
  picker: { 
    height: 50, 
    marginBottom: 20 
  },
  section: { 
    marginBottom: 20 
  },
  item: { 
    padding: 5, 
    fontSize: 14 
  },
  detailItem: {
    padding: 3,
    fontSize: 12,
    color: '#666'
  },
  insightContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5
  }
});