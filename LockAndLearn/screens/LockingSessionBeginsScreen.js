import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View, Button, Modal } from "react-native";

const LockingSessionBeginsScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [password, setPassword] = useState("");

  const closeSession = () => {
    if (password === "your_password") { // Replace "your_password" with the actual password
      navigation.goBack();
    } else {
      // Handle incorrect password
    }
    setModalVisible(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#407BFF" }}>
      <Text>Locking Session Begins</Text>
      <Button title="End Session" onPress={() => setModalVisible(true)} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <View style={{ backgroundColor: "#fff", padding: 20 }}>
            <Text>Enter Password:</Text>
            <TextInput
              secureTextEntry={true}
              value={password}
              onChangeText={text => setPassword(text)}
            />
            <Button title="Enter" onPress={closeSession} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LockingSessionBeginsScreen;

