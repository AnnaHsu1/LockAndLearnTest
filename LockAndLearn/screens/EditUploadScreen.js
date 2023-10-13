import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, Image, TextInput, navigation, Platform, ImageBackground } from "react-native";
import {React, useState} from "react";
import * as DocumentPicker from "expo-document-picker";
import { TouchableOpacity } from "react-native";

const EditUploadScreen = ({ navigation }) => {
    const [text, setText] = useState("fileUpload1.pdf");    
    const nbFileUploaded = "2/3"
    const [fileName, setFileName] = useState();
    const uploadedFiles = [
      { id: 1, type: 'successful' },
      { id: 2, type: 'error' },
      { id: 3, type: 'successful' },
      { id: 4, type: 'error' },
      { id: 5, type: 'error' },
    ];

    // receive file uploaded by user and (to be redirect to server)
    const fileSelectedHandler = async () => {
      let result = await DocumentPicker.getDocumentAsync({});
      if (Platform.OS === "web") {
        setFileName(result.output[0].name);
      } else if (Platform.OS === "android") {
        setFileName(result.assets[0].name);
      }
    };

  return (

        // display the blue background on top of screen
      <ImageBackground
        source={require("../assets/backgroundCloudyBlobsFull.png")}
        resizeMode="cover"
        style={styles.container}>
        {/* display container to select file with the appropriate formats */}
        <View style={styles.containerFile}>
          <Text style={styles.selectFiles}>Select files</Text>
          <View style={{alignItems: "center", marginTop:"0.5%"}}>
            {/* display button to upload file */}
            <TouchableOpacity testID="selectButton" onPress={fileSelectedHandler} accept=".pdf, docx, .txt">
              <ImageBackground           
                style={styles.imageUpload} 
                source={require("../assets/UploadDashedZoneH.png")}>
                <Text style={styles.supportedFormats}>Supported formats:{"\n"}PDF, TXT, DOCX</Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>
          <View style={styles.containerUploaded}>    
            <Text style={styles.uploadFiles}>Uploads - {nbFileUploaded} files</Text>
            {/* display rows for each uploaded file */}
            {uploadedFiles.map(file => (
              <View>
                <View key={file.id} style={[styles.rows, file.type === 'successful' ? styles.successRowUpload : styles.errorRowUpload]}>
                  <View style={styles.rowUpload}>
                    <TextInput
                      style={styles.errorTextbox}
                      onChangeText={(newText) => setText(newText)}
                      defaultValue={text}
                    />
                  <TouchableOpacity
                    testID="deleteButton"
                    style={styles.buttonDelete}
                    onPress={()=>""}>
                      {file.type === "successful" && (
                        <Image style={{height:20, width:20}} source={require("../assets/bxs_x-circle.png")}/>
                      )}
                      {file.type === "error" && (
                        <Image style={{height:20, width:20}} source={require("../assets/trash.png")}/>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
                <View>
                  {file.type === "error" && (
                      <View style={styles.errorMsgRow}>
                        <Text style={styles.errorText}>This format is not supported. Please try again.</Text>
                      </View>
                    )}
                </View>
              </View>
            ))}
            {/* display button to confirm: uploading files */}
            <View style={{alignItems: "center", paddingLeft:"10%"}}>
              <TouchableOpacity
                  style={[styles.buttonUpload, {marginTop:"3%"}, {marginBottom:"3%"}]}
                  testID="uploadButton">
                  <Text style={styles.buttonText}>Upload</Text>
                </TouchableOpacity>
            </View>
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
    width:"100%", 
    height:"100%"
  },
  containerFile: {
    flex:1,
    backgroundColor: "#FAFAFA",
    alignItems: "center",
    width: "100%",
    minHeight: "100%",
    borderTopLeftRadius:40,
    borderTopRightRadius:40,
    marginTop:"10%",
  },
  selectFiles: {
    color: "#696969",
    fontSize: 36,
    fontWeight: "500",
    marginTop:"1%"
  },
  imageUpload:{
    resizeMode: "contain",
    width: 221,
    height: 130,
  },
  supportedFormats: {
    color: "#ADADAD",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    marginTop:"40%"
  },
  containerUploaded: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "left",
    width:"100%", 
    height:"100%",
    backgroundColor:"#FAFAFA",
    paddingLeft: "5%",
    paddingRight: "13%",
  },
  uploadFiles:{
    color: "#696969",
    fontSize: 20,
    fontWeight: "500",
    marginTop:"0.5%",
    marginBottom:"0.5%"
  },
  rows:{
    // marginBottom:"1%",
  },
  rowUpload:{
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
  },
  successRowUpload:{
    borderRadius: 10,
    borderColor: "#61A750",
    borderStyle: "solid",
    borderWidth: 1,
    marginBottom:"1%",
  },
  errorRowUpload:{
    borderRadius: 10,
    borderColor: "#F24E1E",
    borderStyle: "solid",
    borderWidth: 1,
  },
  errorTextbox: {
    flex:0.9,
    padding:10,
  },
  buttonDelete:{
    flex:0.1,
    alignItems:"center",
    justifyContent:"center"
  },
  errorMsgRow:{
    marginBottom:"1%",
  },
  errorText:{
    color: "#F24E1E",
    fontSize: 10.76,
    fontWeight: "500",
    // lineHeight: 19.37,
  },
  buttonUpload:{
    backgroundColor: "#407BFF",
    width: 190,
    height: 35,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  buttonText:{
    color: "#FFFFFF", 
    alignItems:"center", 
    fontSize: 15, 
    fontWeight: "500"
  },
});

export default EditUploadScreen;
