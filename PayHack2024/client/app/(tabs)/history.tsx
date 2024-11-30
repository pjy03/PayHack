import { useState } from "react";
import { Button, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function History() {
  // Example list of bank applications with their interest rates
  const [applications, setApplications] = useState([
    { id: "1", bankName: "Public Bank", interestRate: 3.5, status: null },
    { id: "2", bankName: "Maybank", interestRate: 4.2, status: null },
    { id: "3", bankName: "CIMB", interestRate: 3.8, status: null },
  ]);

  const handleResponse = (id: string, response: "accept" | "reject") => {
    setApplications((prevApplications) =>
      prevApplications.map((application) =>
        application.id === id
          ? { ...application, status: response }
          : application
      )
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.applicationCard}>
      <Text style={styles.bankName}>{item.bankName}</Text>
      <Text style={styles.interestRate}>
        Interest Rate: {item.interestRate}%
      </Text>

      {/* Displaying accept/reject buttons based on the current status */}
      {item.status === null ? (
        <View style={styles.buttonContainer}>
          <Button
            title="Accept"
            onPress={() => handleResponse(item.id, "accept")}
            color="green"
          />
          <Button
            title="Reject"
            onPress={() => handleResponse(item.id, "reject")}
            color="red"
          />
        </View>
      ) : (
        <Text style={styles.status}>
          {item.status === "accept" ? "Accepted" : "Rejected"}
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>Bank Application History</Text>
        <FlatList
          data={applications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  applicationCard: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  bankName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  interestRate: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  status: {
    fontSize: 16,
    color: "#007BFF",
    fontWeight: "bold",
    marginTop: 10,
  },
});
