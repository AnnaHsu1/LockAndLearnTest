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

const LoginScreen = ({ navigation }) => {
  const [text, setText] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log in to your _____ account</Text>

      <Text style={styles.field}>Email</Text>
      <TextInput
        style={styles.textbox}
        onChangeText={(newText) => setText(newText)}
        defaultValue={text}
      />

      <Text style={styles.field}>Password</Text>
      <TextInput
        style={styles.textbox}
        onChangeText={(newText) => setText(newText)}
        defaultValue={text}
      />

      <Button color="#4F85FF" title="Log in" />

      <Text style={styles.link}>Forgot password?</Text>
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "start",
    justifyContent: "start",
    marginLeft: 20,
    marginTop: 20,
  },
  title: {
    color: "#4F85FF",
    fontFamily: "Montserrat",
    fontSize: 20,
  },
  field: {
    color: "#ADADAD",
    fontFamily: "Montserrat",
    fontSize: 15,
  },
  link: {
    color: "#4F85FF",
    fontFamily: "Montserrat",
    fontSize: 15,
  },
  textbox: {
    minHeight: 50,
    borderRadius: 10,
    borderColor: "#407BFF",
    borderStyle: "solid",
    borderWidth: 1,
  },
});

export default LoginScreen;
