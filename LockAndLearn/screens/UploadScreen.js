import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, Image, Platform } from "react-native";
import { React, useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import { TouchableOpacity } from "react-native";

const UploadScreen = () => {
  const [fileName, setFileName] = useState();

  const fileSelectedHandler = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    if (Platform.OS === "web") {
      setFileName(result.output[0].name);
    } else if (Platform.OS === "android") {
      setFileName(result.assets[0].name);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.selectFiles}>Select files</Text>
      <View style={styles.uploadContainer}>
        <Text style={styles.supportedFormats}>Supported formats:</Text>
        <Text style={styles.supportedFormats}>PDF, TXT, DOCX</Text>
        <TouchableOpacity testID="selectButton" title="Select File" onPress={fileSelectedHandler} accept=".pdf, docx, .txt">
          <Image source={require("../assets/uploadDashedZone.png")} style={styles.image} />
        </TouchableOpacity>
      </View>
      <Text>{fileName}</Text>
      <Button testID="uploadButton" title="Upload" />
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
    fontSize: 36,
    fontWeight: "500"
  },
  image: {
    zIndex: 1
  },
  supportedFormats: {
    color: "#ADADAD",
    fontSize: 15,
    fontWeight: "600"
  }
});

export default UploadScreen;
