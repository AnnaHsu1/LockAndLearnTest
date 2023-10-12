import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  navigation,
} from "react-native";

const LockingSessionBeingsScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, backgroundColor: "#407BFF" }}>
      <Text>Locking Session Begins</Text>
      <Button title="End Session" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default LockingSessionBeingsScreen;
