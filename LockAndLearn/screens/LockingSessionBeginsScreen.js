import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View, Button, Modal, Image } from "react-native";

const LockingSessionBeginsScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [password, setPassword] = useState("");

  const closeSession = () => {
    if (password === "your_password") { 
      navigation.goBack();
    } else {
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/homescreen.png")} 
        style={styles.logo} 
      />
      <Button title="End Session" onPress={() => setModalVisible(true)} style={styles.endSessionButton} />

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
              onChangeText={text => setPassword(text)}
            />
            <View style={styles.modalButtons}>
              <Button title="Enter" onPress={closeSession} />
              <View style={styles.buttonSpacing} />
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
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
  },
  endSessionButton: {
    position: "absolute",
    top: 20,
    right: 20,
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
  buttonSpacing: {
    width: 10, // Add spacing between the buttons
  },
  logo: {
    alignSelf: "center",
    marginTop: "auto",
    marginBottom: "auto",
  },
});

export default LockingSessionBeginsScreen;
