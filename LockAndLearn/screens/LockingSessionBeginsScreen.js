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

  const closeSession = () => {
    if (password === "1234") {
      // Navigate to the "Home" screen when the password is "1234"
      navigation.navigate("Home");
    } else {
      // Handle incorrect password
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <Spacer height={20} />
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
      <Spacer height={20} />
      <TouchableOpacity
        style={styles.customButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.customButtonText}>End Session</Text>
      </TouchableOpacity>
      <Spacer height={20} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Enter Password:</Text>
            <TextInput
              style={styles.modalInput}
              secureTextEntry={true}
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
            <Spacer height={20} />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.customButton}
                onPress={closeSession}
              >
                <Text style={styles.customButtonText}>Enter</Text>
              </TouchableOpacity>
              <Spacer width={10} />
              <TouchableOpacity
                style={styles.customButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.customButtonText}>Cancel</Text>
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
    borderRadius: 10, // Rounded corners
  },
  modalText: {
    marginBottom: 10, // Add spacing below the text
  },
  modalInput: {
    marginBottom: 10, // Add spacing below the input field
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  logo: {},
  logoText: {
    color: "#FFFFFF",
    fontSize: 24, // Larger font size
    marginTop: 20, // Add some space above the text
  },
  logoTextBig: {
    color: "#FFFFFF",
    fontSize: 36, // Larger font size
  },
});

export default LockingSessionBeginsScreen;
