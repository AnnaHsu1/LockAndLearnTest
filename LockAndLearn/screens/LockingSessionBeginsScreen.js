import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View, Button, Modal } from "react-native";

const LockingSessionBeginsScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [password, setPassword] = useState("");

  const closeSession = () => {
    if (password === "1234") {
      // Redirect to the "Home" screen when the correct password is entered
      navigation.navigate("Home");
    } else {
      // Handle incorrect password
      alert("Incorrect password. Please try again.");
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>It's time to LOCK & LEARN</Text>
      </View>

      <Button title="End Session" onPress={() => setModalVisible(true)} style={styles.endSessionButton} />

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
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
    alignItems: "center",
  },
  headerContainer: {
    flex: 1,
    justifyContent: "center",
  },
  headerText: {
    color: "#FFFFFF",
    fontSize: 24,
    textAlign: "center",
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 10,
  },
  modalText: {
    marginBottom: 10,
  },
  modalInput: {
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonSpacing: {
    width: 10,
  },
});

export default LockingSessionBeginsScreen;
