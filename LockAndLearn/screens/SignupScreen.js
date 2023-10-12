import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  Image,
  navigation,
} from "react-native";
import { RadioButton } from 'react-native-paper';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const SignupScreen = ({ navigation }) => {
    const [text, setText] = useState("");
    const [checked, setChecked] = React.useState('first');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create your account</Text>
      <Text style={styles.field}>Email</Text>
      <TextInput
        style={styles.textbox}
        onChangeText={(newText) => setText(newText)}
        defaultValue={text}
      />

          <View style={styles.row}>
              <View style={styles.nameInputContainer}>
                  <Text style={styles.field}>First Name</Text>
                  <TextInput
                      style={styles.textbox}
                      onChangeText={(newText) => setText(newText)}
                      defaultValue={text}
                  />
              </View>

              <View style={styles.nameInputContainer}>
                  <Text style={styles.field}>Last Name</Text>
                  <TextInput
                      style={styles.textbox}
                      onChangeText={(newText) => setText(newText)}
                      defaultValue={text}
                  />
              </View>
          </View>
      

          <Text style={styles.field}>Select your account type</Text> 
          <View>
              <RadioButton
                  value="parent"
                  status={checked === 'parent' ? 'checked' : 'unchecked'}
                  onPress={() => setChecked('parent')}
              /> <Text>Parent</Text>
              <RadioButton
                  value="teacher"
                  status={checked === 'teacher' ? 'checked' : 'unchecked'}
                  onPress={() => setChecked('teacher')}
              /> <Text>Teacher</Text>
          </View>
      <Text style={styles.field}>Birth Date</Text>
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

      <Text style={styles.field}>Confirm password</Text>
      <TextInput
        style={styles.textbox}
        onChangeText={(newText) => setText(newText)}
        defaultValue={text}
      />
      <Button color="#4F85FF" title="Sign up" />

      <Text style={styles.link}>Already have an account? Sign in</Text>
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginLeft: 20,
    marginTop: 20,
  },
  row: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
    },
  nameInputContainer: {
    marginRight: 10
    },
  title: {
    color: "#4F85FF",
    fontFamily: "Montserrat",
      fontSize: 20,
      textAlign: "left",
  },
  button: {
    color: "#ffffff",
    backgroundColor: "#4F85FF",
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

export default SignupScreen;
