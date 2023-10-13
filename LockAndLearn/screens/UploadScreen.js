import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, Image, Platform } from "react-native";
import { React, useRef, useState } from "react";
import * as DocumentPicker from "expo-document-picker";


const UploadScreen = () => {

  const [fileName, setFileName] = useState();

  const fileSelectedHandler = async() => {

    let result = await DocumentPicker.getDocumentAsync({});
    
    if (Platform.OS === "web") {
      setFileName(result.output[0].name);
    }
    else if (Platform.OS === "android") {
      setFileName(result.assets[0].name);
    }
  }

  return ( 
    <View style={styles.container}>
      <Text style={styles.selectFiles}>Select files</Text>
      <View style={styles.uploadContainer}>
        {/* Image doesn't display -> to be fixed */}
        <Image source={require("../assets/uploadDashedZone.png")} style={styles.image} />
        <Text style={styles.supportedFormats}>Supported formats:</Text>
        <Text style={styles.supportedFormats}>PDF, TXT, DOCX</Text>
        <Button title="Select File" onPress={fileSelectedHandler} accept=".pdf, docx, .txt" ></Button>
      </View>
      <Text>{fileName}</Text>
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
    justifyContent: "center"
  },
  uploadContainer: {
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center"
  },
  inputContainer: {
    alignItems: "center"
  },
  selectFiles: {
    color: "#696969",
    fontsize: "36px",
    fontfamily: "Montserrat",
    fontweight: "500",
    wordwrap: "breakword"
  },
  image:{
    zIndex: 1,
  },
  supportedFormats: {
    color: "#ADADAD",
    fontsize: "15px",
    fontfamily: "Montserrat",
    fontweight: "600",
    wordwrap: "breakword"
  }
});

export default UploadScreen;
