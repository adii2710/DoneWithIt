import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { IP_API_URL } from '@env';

export default function Dashboard({navigation}) {
  const [availableFamilies, setAvailableFamilies] = useState([]);
  const [selectedFamily, setSelectedFamily] = useState('');
  const [memberContributions, setMemberContributions] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchFamilies();
    // fetchMembers();
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

  const fetchMembers = async (familyId) => {
    if (!familyId) {
      console.error("Family ID is undefined!");
      return;
    }
    try {
      const response = await axios.get(`http://${IP_API_URL}:5000/api/transactions/f-details/${familyId}`);

    } catch (error) {
      console.error("Error fetching member IDs:", error);
    }
    
  };
  

  const fetchFamilyData = async (familyID) => {
    try {
      const response = await axios.get(`http://${IP_API_URL}:5000/api/transactions?Family_ID=${familyID}`);
      const contributions = response.data.reduce((acc, curr) => {
        acc[curr.Member_ID] = (acc[curr.Member_ID] || 0) + curr.Amount;
        return acc;
      }, {});
      setMemberContributions(contributions);
    } catch (error) {
      Alert.alert('Error', 'Could not fetch family data');
      setMemberContributions({});
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    Promise.all([
      fetchFamilies(),
      selectedFamily ? [fetchFamilyData(selectedFamily)] : Promise.resolve()
    ]).finally(() => {
      setRefreshing(false);
    });
  }, [selectedFamily]);

  const handleFamilySelect = (familyID) => {
    setSelectedFamily(familyID);
    if (familyID) fetchFamilyData(familyID);
    if (familyID) fetchMembers(familyID);
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#4A90E2', '#1E6FEB']}
          tintColor="#1E6FEB"
        />
      }
      contentContainerStyle={styles.scrollViewContent}
      keyboardShouldPersistTaps="handled"
    >
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

      {selectedFamily && (
        <View>
          <Text style={styles.sectionHeader}>Analysis for Family: {selectedFamily}</Text>

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
    flex: 1 
  },
  scrollViewContent: {
    padding: 20,
    paddingBottom: 100
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
  }
});