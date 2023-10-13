import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Text, TextInput, View, navigation, Image } from "react-native";
import {
  CreateResponsiveStyle,
  DEVICE_SIZES,
  minSize,
  useDeviceSize,
} from "rn-responsive-styles";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Button } from "react-native-paper";

const LoginScreen = ({ navigation }) => {
  const styles = useStyles();
  const deviceSize = useDeviceSize();
  const [text, setText] = useState("");

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <Text style={styles.title}>Log in to your _____ account</Text>

        <View style={styles.item}>
          <Text style={styles.field}>Email</Text>
          <TextInput
            style={[styles.textbox, styles.full_width]}
            onChangeText={(newText) => setFdata({ ...fdata, Email: newText })}
            defaultValue={text}
          />
        </View>

        <View style={styles.item}>
          <Text style={styles.field}>Password</Text>
          <TextInput
            style={[styles.textbox, styles.full_width]}
            onChangeText={(newText) => setFdata({ ...fdata, Email: newText })}
            defaultValue={text}
          />
        </View>

        <Button
          mode="contained"
          onPress={() => {
            SendToBackend();
          }}
          style={[styles.button, styles.full_width]}
        >
          LOG IN
        </Button>

        <Text style={styles.link}>Forgot password?</Text>
        <StatusBar style="auto" />
      </View>
      <Image
        style={styles.bottomCloud}
        source={require("../assets/bottomClouds.png")}
      />
    </View>
  );
};

const useStyles = CreateResponsiveStyle(
  {
    page: {
      backgroundColor: "#ffffff",
      maxWidth: wp("100%"),

      flex: 1,
      alignItems: "center",
    },
    container: {
      minWidth: wp("90%"),
      minHeight: hp("60%"),
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 20,
    },
    item: {
      display: "flex",
      width: "100%",
      paddingVertical: 10,
    },
    row: {
      flexDirection: "row",
    },
    nameInput: {
      justifyContent: "space-between",
    },
    radio: {
      alignItems: "center",
      justifyContent: "space-around",
    },
    radio_item: {
      alignItems: "center",
      alignContent: "center",
    },
    title: {
      color: "#4F85FF",
      fontSize: 24,
      textAlign: "left",
    },
    button: {
      color: "#ffffff",
      backgroundColor: "#4F85FF",
      borderRadius: 10,
      marginTop: 10,
    },
    field: {
      color: "#ADADAD",
    },
    checked: {
      color: "#000",
    },
    link: {
      color: "#4F85FF",
      paddingTop: 10,
      textAlign: "center",
    },
    textbox: {
      display: "flex",
      minHeight: 30,
      borderRadius: 10,
      borderColor: "#407BFF",
      borderStyle: "solid",
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderWidth: 1,
    },
    full_width: {
      minWidth: "100%",
    },
    auto_width: {
      minWidth: "auto",
    },
    half_width: {
      width: wp("40%"),
    },
    bottomCloud: {
      display: "flex",
      justifyContent: "flex-end",
      width: wp("100%"),
      height: 250,
      resizeMode: "stretch",
    },
  },
  {
    [minSize(DEVICE_SIZES.MD)]: {
      container: {
        minWidth: 500,
        width: 500,
      },
      half_width: {
        width: 240,
      },
      bottomCloud: {
        width: wp("100%"),
        height: 300,
        resizeMode: "stretch",
        flex: 1,
      },
    },
  }
);

export default LoginScreen;
