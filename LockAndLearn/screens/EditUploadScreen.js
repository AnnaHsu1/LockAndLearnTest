import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, Image, TextInput, navigation } from "react-native";
import {React, useState} from "react";

const EditUploadScreen = ({ navigation }) => {
    const [text, setText] = useState("");    
    const nbFileUploaded = "2/3"

  return (
    <View style={styles.container}>

      <Text style={styles.selectFiles}>Select files</Text>
    
     <View>
        {/* Image doesn't display -> to be fixed */}
      <Image source={require('../assets/uploadDashedZone.png')} style={styles.image} />
      <Text style={styles.supportedFormats}>Supported formats:</Text>
      <Text style={styles.supportedFormats}>PDF, TXT, DOCX</Text>
      <Text style={styles.uploadFiles}>Uploads - {nbFileUploaded} files</Text>
    </View>

    <View>
      <Text style={styles.field}>1st file uploaded</Text>
      <TextInput
        style={styles.textbox}
        onChangeText={(newText) => setText(newText)}
        defaultValue={text}
      />
      <Text style={styles.error}>This format is not supported. Please try again.</Text>
    </View>


      
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
  field: {
    color: "#888888",
    fontsize: "14px",
    fontFamily: "Montserrat",
    fontweight: "500",
    wordwrap: "breakword",
  },
  textbox: {
    minHeight: 50,
    borderRadius: 10,
    borderColor: "#61A750",
    borderStyle: "solid",
    borderWidth: 1,
  },
  error:{
    color: "#F24E1E",
    fontsize: "10.76px",
    fontfamily: "Mulish",
    fontweight: "500",
    lineheight: "19.37px",
    wordwrap: "break-word",
  },
  supportedFormats:{
    color: "#ADADAD",
    fontsize: "15px",
    fontfamily: "Montserrat",
    fontweight: "600",
    wordwrap: "breakword",
  },
  uploadFiles:{
    color: "#696969",
    fontsize: "20px",
    fontfamily: "Montserrat",
    fontweight: "500",
    wordwrap: "breakword",
  }
});

export default EditUploadScreen;
