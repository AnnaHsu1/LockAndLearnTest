import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, Image, Platform, ImageBackground } from "react-native";
import { React, useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import { TouchableOpacity } from "react-native";

const UploadScreen = () => {
  const [fileName, setFileName] = useState([]);

  // receive file uploaded by user and (to be redirect to server)
  const fileSelectedHandler = async () => {
    let result = await DocumentPicker.getDocumentAsync({ multiple: true });
    if (Platform.OS === "web") {
      const selectedFileNames = Array.from(result.output).map(file => file.name)
      const noDuplicateFiles = selectedFileNames.filter(name => !fileName.includes(name));
      setFileName([...fileName, ...noDuplicateFiles]);
    } else if (Platform.OS === "android") {
      const selectedFileNames = result.assets.map(file => file.name);
      const noDuplicateFiles = selectedFileNames.filter(name => !fileName.includes(name));
      setFileName([...fileName, ...noDuplicateFiles]);
    }
  };

  return (
    // display the blue background on top of screen
    <ImageBackground source={require("../assets/backgroundCloudyBlobsFull.png")} resizeMode="cover" style={styles.container}>
      {/* display container to select file with the appropriate formats */}
      <View style={styles.containerFile}>
        <Text style={styles.selectFiles}>Select files</Text>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "space-evenly" }}>
          {/* display button to upload file */}
          <TouchableOpacity testID="selectButton" onPress={fileSelectedHandler} accept=".pdf, docx, .txt">
            <ImageBackground style={styles.imageUpload} source={require("../assets/uploadDashedZone.png")}>
              <Text style={styles.supportedFormats}>Supported formats:{"\n"}PDF, TXT, DOCX</Text>
            </ImageBackground>
          </TouchableOpacity>
          {fileName.length > 0 && <Text style={styles.filesText}>Files selected: </Text>}
          {fileName.map((name, index) => (
            <Text key={index} style={styles.filesName}>
              {name}
            </Text>
          ))}
          <TouchableOpacity style={styles.buttonUpload} testID="uploadButton">
            <Text style={styles.buttonText}>Upload</Text>
          </TouchableOpacity>
          {/* display uploaded file */}
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%"
  },
  containerFile: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    alignItems: "center",
    width: "100%",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: "5%"
  },
  selectFiles: {
    color: "#696969",
    fontSize: 36,
    fontWeight: "500",
    marginTop: "1%"
  },
  supportedFormats: {
    color: "#ADADAD",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    marginTop: "95%"
  },
  imageUpload: {
    resizeMode: "contain",
    width: 198,
    height: 250
  },
  filesText: {
    padding: 10
  },
  filesName: {
    padding: 0
  },
  buttonUpload: {
    backgroundColor: "#407BFF",
    width: 190,
    height: 45,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    padding: 10
  },
  buttonText: {
    color: "#FFFFFF",
    alignItems: "center",
    fontSize: 20,
    fontWeight: "500"
  }
});

export default UploadScreen;
