import { useColorScheme } from "@/hooks/useColorScheme";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>
        <View
          style={[
            styles.header,
            { backgroundColor: isDarkMode ? "#333" : "#f5f5f5" },
          ]}
        >
          <Text
            style={[styles.name, { color: isDarkMode ? "white" : "black" }]}
          >
            Alex
          </Text>
        </View>
        <View style={styles.body}>
          <Image
            source={require("../../assets/images/logo.jpg")}
            style={styles.profilePic}
          />
          <View style={styles.bodyContent}>
            <Text style={styles.info}>Account Number: 7773240</Text>
            <Text style={styles.info}>Email: alex@example.com</Text>
            <Text style={styles.info}>Phone: +60 12-345 6789</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>QnA</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>LogOut</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingBottom: 20,
  },
  header: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#1E90FF",
  },
  name: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: "bold",
  },
  body: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    marginTop: 30,
  },
  bodyContent: {
    width: "90%",
    alignItems: "center",
    marginBottom: 20,
  },
  info: {
    fontSize: 18,
    marginTop: 10,
    color: "#333",
  },
  buttonContainer: {
    width: "90%",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#1E90FF",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});
