import { useNavigation } from "@react-navigation/native";
import { Card } from "@rneui/themed";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import axios from "react-native-axios";
import DropDownPicker from "react-native-dropdown-picker";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [text, onChangeText] = useState("");
  const [repayment, onChangeRepayment] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([
    { label: "Low Interest Loans", value: "low-interest" },
    { label: "Quick Approval Loans", value: "quick-approval" },
    { label: "Educational Loans", value: "education" },
    { label: "Business Loans", value: "business" },
  ]);
  const [publicBankInterestRate, setPublicBankInterestRate] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  
  const navigation = useNavigation();

  const fetchDynamicInterestRate = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loan_amnt: 35000,
          loan_intent: "PERSONAL",
          credit_score: 561,
          loan_term: 36
        }),
      });
    
      // Ensure the response is JSON
      const data = await response.json();
    
      // Directly access the value
      const predictedLoanIntRate = data.predicted_loan_int_rate;
      setPublicBankInterestRate(predictedLoanIntRate);
    } catch (error) {
      console.error("Error fetching interest rate:", error);
      Alert.alert("Error", "Unable to fetch interest rate. Please try again.");
    }
    
  };

  const handleSearch = () => {
    if (!text.trim() || !selectedCategory) {
      Alert.alert("Error", "Please enter search text and select a category.");
      return;
    }
    fetchDynamicInterestRate();

    // Simulate fetching search results (Replace with actual API call)
    const results = [
      { id: 1, title: "Low Interest Loan", description: "From 4.5% APR" },
      { id: 2, title: "Quick Approval Loan", description: "Approval in 24 hours" },
    ];
    setSearchResults(results); // Store the search results
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Header Section */}
          <View style={styles.headerContainer}>
            <Image
              source={require("../../assets/images/logo.jpg")}
              style={styles.profilePic}
            />
            <View style={styles.headerTextContainer}>
              <Text style={styles.header}>KreditKita</Text>
            </View>
          </View>
          <View>
            <Text style={styles.subheader}>
              A real-time microloan marketplace powered by Open Finance APIs
            </Text>
          </View>
          {/* Search Section */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.input}
              placeholder="Search for matching loans..."
              placeholderTextColor="#aaa"
              onChangeText={onChangeText}
              value={text}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter repayment period (in month)..."
              placeholderTextColor="#aaa"
              onChangeText={onChangeRepayment}
              value={repayment}
            />
          </View>

          <View style={styles.itemsRow}>
            {/* Category Dropdown */}
            <View style={styles.dropdownContainer}>
              <DropDownPicker
                open={open}
                value={selectedCategory}
                items={categories}
                setOpen={setOpen}
                setValue={setSelectedCategory}
                setItems={setCategories}
                placeholder="Select a category"
                containerStyle={[styles.dropdownContainer]}
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownList}
                zIndex={1000}
                zIndexInverse={3000}
              />
            </View>

            {/* Search Button */}
            <Pressable
              style={({ pressed }) => [
                styles.searchButton,
                pressed && { opacity: 0.8 },
              ]}
              onPress={handleSearch}
            >
              <Text style={styles.buttonLabel}>Search</Text>
            </Pressable>
          </View>

          {/* Featured Loans Section */}
          {searchResults.length > 1 && ( // Conditionally render if results length > 1
            <View>
              <Text style={styles.sectionTitle}>Featured Loans</Text>
              <View style={styles.itemsRow}>
                {searchResults.map((loan) => (
                  <View key={loan.id} style={styles.itemCard}>
                    <Text style={styles.itemTitle}>{loan.title}</Text>
                    <Text style={styles.itemPrice}>{loan.description}</Text>
                  </View>
                ))}
              </View>
              <Card containerStyle={styles.card}>
            <Card.Title style={styles.cardTitle}>Public Bank</Card.Title>
            <Card.Divider />
            <Text style={styles.cardText}>Loan Value: {text}</Text>
            <Text style={styles.cardText}>
              Interest Rate: {publicBankInterestRate}
            </Text>
            <Pressable
              style={({ pressed }) => [
                styles.applyButton,
                pressed && { opacity: 0.8 },
              ]}
              onPress={() => navigation.navigate('bank', { interestRate: publicBankInterestRate })}
            >
              <Text style={styles.buttonLabel}>Apply</Text>
            </Pressable>
          </Card>
            </View>
          )}

        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f9fb",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  headerTextContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
    textAlign: "left",
  },
  subheader: {
    fontSize: 16,
    color: "#7f8c8d",
    textAlign: "center",
    marginBottom: 10,
  },
  searchContainer: {
    marginBottom: 10,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#bdc3c7",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#2c3e50",
    marginBottom: 15,
  },
  itemsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  dropdownContainer: {
    width: "70%",
    zIndex: 1000, // Ensure dropdown container has a higher stacking context
  },
  dropdown: {
    backgroundColor: "#fff",
    borderColor: "#bdc3c7",
    borderWidth: 1,
    borderRadius: 8,
  },
  dropdownList: {
    backgroundColor: "#fff",
    borderColor: "#bdc3c7",
    borderWidth: 1,
    zIndex: 1000, // Ensure dropdown list appears above
    elevation: 3, // Add elevation for Android
  },
  searchButton: {
    width: "25%",
    backgroundColor: "#3498db",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  applyButton: {
    width: "100%",
    backgroundColor: "#3498db",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 10,
  },
  itemCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
    width: "48%",
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 14,
    color: "#7f8c8d",
  },
  card: {
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  cardText: {
    fontSize: 16,
    color: "#7f8c8d",
    marginTop: 10,
  },
});
