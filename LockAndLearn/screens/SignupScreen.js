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

  const [fdata, setFdata] = useState({
    FirstName: "",
    LastName: "",
    Account: "",
    Email: "",
    Password: "",
    CPassword: "",
    DOB: "",
  });

  const [errormsg, setErrormsg] = useState(null);
  const [text, setText] = useState("");
  const [checked, setChecked] = React.useState("first");

  const handleSubmit = async () => {
    console.log(fdata);
  
    if (
      fdata.FirstName === "" ||
      fdata.LastName === "" ||
      fdata.Email === "" ||
      fdata.Password === "" ||
      fdata.CPassword === "" ||
      fdata.DOB === ""
    ) {
      setErrormsg("All fields are required");
      return;
    } else {
      if (fdata.Password !== fdata.CPassword) {
        setErrormsg("The passwords must be the same");
        return;
      }
    }

    // Package the user data into a JSON format and ship it to the backend
    try {
      const response = await fetch('http://localhost:4000/users/signup', {  
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fdata), // Send user data as JSON
      });

      const data = await response.json();

      if (response.status === 201) {
        // User created successfully
        console.log("User created successfully in database!", data);
      } else {
        
        // Store the error message in state
        setErrormsg(data.message); 
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }

  };
  
  return (
    <View style={styles.container}>
      {errormsg ? <Text style={{ color: "red" }}>{errormsg}</Text> : null}
      <Text style={styles.title}>Create your account</Text>
      <Text style={styles.field}>Email</Text>
      <TextInput
        style={styles.textbox}
        onChangeText={(newText) => setFdata({ ...fdata, Email: newText })}
        defaultValue={text}
      />

      <View style={styles.row}>
        <View style={styles.nameInputContainer}>
          <Text style={styles.field}>First Name</Text>
          <TextInput
            style={styles.textbox}
            onChangeText={(newText) =>
              setFdata({ ...fdata, FirstName: newText })
            }
            defaultValue={text}
          />
        </View>

        <View style={styles.nameInputContainer}>
          <Text style={styles.field}>Last Name</Text>
          <TextInput
            style={styles.textbox}
            onChangeText={(newText) =>
              setFdata({ ...fdata, LastName: newText })
            }
            defaultValue={text}
          />
        </View>
      </View>

      <Text style={styles.field}>Select your account type</Text>
      <View>
        <RadioButton
          value="parent"
          status={checked === "parent" ? "checked" : "unchecked"}
          onPress={() => setChecked("parent")}
        />{" "}
        <Text>Parent</Text>
        <RadioButton
          value="teacher"
          status={checked === "teacher" ? "checked" : "unchecked"}
          onPress={() => setChecked("teacher")}
        />{" "}
        <Text>Teacher</Text>
      </View>
      <Text style={styles.field}>Birth Date</Text>
      <TextInput
        style={styles.textbox}
        onChangeText={(newText) => setFdata({ ...fdata, DOB: newText })}
        defaultValue={text}
      />
      <Text style={styles.field}>Password</Text>
      <TextInput
        style={styles.textbox}
        secureTextEntry={true}
        onChangeText={(newText) => setFdata({ ...fdata, Password: newText })}
        defaultValue={text}
      />

      <Text style={styles.field}>Confirm password</Text>
      <TextInput
        style={styles.textbox}
        secureTextEntry={true}
        onChangeText={(newText) => setFdata({ ...fdata, CPassword: newText })}
        defaultValue={text}
      />
      <Button
        color="#4F85FF"
        onPress={() => {
          handleSubmit();
        }}
        title="Sign up"
      />

      <Text style={styles.link}>
        Already have an account? &nbsp;
        <Text styles={styles.link} onPress={() => navigation.navigate("Login")}>
          Sign in
        </Text>
      </Text>
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
