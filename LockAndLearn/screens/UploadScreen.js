import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, Image, navigation } from "react-native";
import { React, useRef, useState } from "react";

const UploadScreen = ({ navigation }) => {
  const fileSelectedHandler = e => {
    console.log(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };
  const inputRef = useRef(null);
  const handleFile = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  const [fileName, setFileName] = useState();

  return (
    <View style={styles.container}>
      <Text style={styles.selectFiles}>Select files</Text>
      <View style={styles.uploadContainer}>
        {/* Image doesn't display -> to be fixed */}
        <Image source={require("../assets/uploadDashedZone.png")} style={styles.image} />
        <Text style={styles.supportedFormats}>Supported formats:</Text>
        <Text style={styles.supportedFormats}>PDF, TXT, DOCX</Text>
        <input type="file" ref={inputRef} style={{ display: "none" }} onChange={fileSelectedHandler} accept=".pdf, docx, .txt" />
      </View>
      <Button title="Choose a file" onPress={handleFile} />
      <Text>{fileName}</Text>
      <p />
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
  image: {
    zIndex: "1"
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
