import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, Image, navigation } from "react-native";
import React from "react";

const UploadScreen = ({ navigation }) => {

  return (
    <View style={styles.container}>
      <Text style={styles.selectFiles}>Select files</Text>
      <Image source={require('../assets/uploadDashedZone.png')} style={styles.image} />
      <Text style={styles.supportedFormats}>Supported formats:</Text>
      <Text style={styles.supportedFormats}>PDF, TXT, DOCX</Text>
      <Button title="Upload" />
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  selectFiles:{
    color: "#696969",
    fontsize: "36px",
    fontfamily: "Montserrat",
    fontweight: "500",
    wordwrap: "breakword",
  },
  image:{
    zIndex: "1",
  },
  supportedFormats:{
    color: "#ADADAD",
    fontsize: "15px",
    fontfamily: "Montserrat",
    fontweight: "600",
    wordwrap: "breakword",
  },
});

export default UploadScreen;
