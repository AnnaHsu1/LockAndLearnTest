import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View, Modal, Image, TouchableOpacity } from "react-native";

// Import the navigation actions and hooks from React Navigation
import { useNavigation } from "@react-navigation/native";

const Spacer = ({ height, width }) => (
  <View style={{ height, width }} />
);

const LockingSessionBeginsScreen = () => {
  const navigation = useNavigation(); // Get the navigation object
  const [modalVisible, setModalVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordBorderColor, setPasswordBorderColor] = useState("#407BFF"); // Initialize border color

  const closeSession = () => {
    if (password === "1234") {
      // Navigate to the "Home" screen when the password is "1234"
      navigation.navigate("Home");
    } else {
      // Handle incorrect password
      setPasswordBorderColor("red"); // Change border color to red
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.centeredContent}>
        <Text style={styles.logoText}>It's time to</Text>
        <Spacer height={20} />
        <Text style={styles.logoTextBig}>LOCK & LEARN !</Text>
        <Spacer height={20} />
        <Image
          source={require("../assets/favicon.png")} // Placeholder image
          style={styles.logo}
        />
      </View>
      <TouchableOpacity
        style={styles.customButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.customButtonText}>End Session</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Enter Password:</Text>
            <TextInput
              style={[styles.modalInput, { borderColor: passwordBorderColor }]} // Apply border color dynamically
              secureTextEntry={true}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordBorderColor("#407BFF"); // Reset border color when typing
              }}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={closeSession}
              >
                <Text style={styles.modalButtonText}>Enter</Text>
              </TouchableOpacity>
              <Spacer width={10} />
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#407BFF",
    alignItems: "center",
    justifyContent: "center", // Center content vertically
  },
  centeredContent: {
    alignItems: "center",
  },
  customButton: {
    backgroundColor: "#FFFFFF", // Background color
    padding: 10,
    borderRadius: 5,
    position: "absolute", // Position the button
    top: 20, // Position from the top
    right: 20, // Position from the right
  },
  customButtonText: {
    color: "#3E5CAA", // Text color
    fontSize: 16,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 30, // Increase the padding for a bigger modal
    width: 80 + '%', // Set the width to 80% of the screen
    height: 40 + '%', // Set the height to 40% of the screen
    borderRadius: 10, // Rounded corners
    justifyContent: "center", // Center content vertically
  },
  modalText: {
    marginBottom: 10, // Add spacing below the text
  },
  modalInput: {
    marginBottom: 10, // Add spacing below the input field
    borderWidth: 1, // Add a border
    borderColor: "#407BFF", // Initial border color
    borderRadius: 5,
    padding: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    backgroundColor: "#407BFF",
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
  },
  logo: {
    marginTop: "25%", // Position the image 25% from the top
  },
  logoText: {
    color: "#FFFFFF",
    fontSize: 24, // Larger font size
  },
  logoTextBig: {
    color: "#FFFFFF",
    fontSize: 36, // Larger font size for LOCK & LEARN !
  },
});

export default LockingSessionBeginsScreen;
