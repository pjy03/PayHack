import { useRoute } from "@react-navigation/native";
import { CheckBox } from "@rneui/themed";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function BankScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { interestRate, title } = route.params;

  const [agree, setAgree] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: title || "Bank Details",
    });
  }, [navigation, title]);

  const handleProceed = () => {
    console.log("Your loan application has been submitted successfully.");
    Alert.alert("Your loan application has been submitted successfully.");
    route;
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {/* Bank Details */}
        <Text style={styles.bankName}>Public Bank</Text>
        <Text style={styles.interestRate}>Interest Rate: {interestRate}</Text>

        {/* Loan Terms */}
        <Text style={styles.title}>Loan Terms and Conditions</Text>

        <Text style={styles.termsText}>
          Please read the following terms and conditions carefully before
          applying for the loan:
        </Text>

        <View style={styles.termsList}>
          <Text style={styles.termsText}>
            1. You agree to repay the loan within the agreed period, along with
            applicable interest.
          </Text>
          <Text style={styles.termsText}>
            2. The loan amount, interest rate, and repayment schedule will be
            provided before the loan agreement.
          </Text>
          <Text style={styles.termsText}>
            3. Failure to repay the loan on time will result in additional
            charges and may affect your credit score.
          </Text>
          <Text style={styles.termsText}>
            4. The lender reserves the right to take legal action in case of
            default.
          </Text>
          <Text style={styles.termsText}>
            5. By proceeding with the loan application, you agree to the privacy
            policy and terms of service of the lender.
          </Text>
        </View>

        {/* Checkbox for agreeing to terms */}
        <View style={styles.checkboxContainer}>
          <CheckBox
            checked={agree}
            onPress={() => setAgree(!agree)}
            containerStyle={styles.checkbox}
            checkedIcon="check-circle"
            uncheckedIcon="circle-o"
            checkedColor="#1E90FF"
          />
          <Text style={styles.checkboxLabel}>
            I agree to the Terms and Conditions
          </Text>
        </View>

        {/* Proceed Button */}
        <TouchableOpacity
          style={[styles.proceedButton, agree && styles.proceedButtonActive]}
          onPress={handleProceed}
          disabled={!agree}
        >
          <Text style={styles.proceedButtonText}>
            Proceed with Loan Application
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#f7f9fb",
  },
  scrollContainer: {
    width: "100%",
    paddingTop: 20,
  },
  bankName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
    textAlign: "center",
    marginBottom: 10,
  },
  interestRate: {
    fontSize: 18,
    color: "#7f8c8d",
    textAlign: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2c3e50",
  },
  termsText: {
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 22,
    color: "#34495e",
  },
  termsList: {
    marginBottom: 30,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#2c3e50",
  },
  proceedButton: {
    backgroundColor: "#bdc3c7",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: "center",
    width: "100%",
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  proceedButtonActive: {
    backgroundColor: "#1E90FF",
  },
  proceedButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
