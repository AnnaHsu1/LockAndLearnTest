import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, TextInput, Platform, ImageBackground } from "react-native";
import { React, useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import { TouchableOpacity } from "react-native";

const EditUploadScreen = () => {
  const [fileName, setFileName] = useState([]);
  const [files, setFiles] = useState(null);

  // function handling with file uploaded by user and its names
  const fileSelectedHandler = async () => {
    let result = await DocumentPicker.getDocumentAsync({ multiple: true });
    if (Platform.OS === "web") {
      const selectedFileNames = Array.from(result.output).map(file => file.name);
      const noDuplicateFiles = selectedFileNames.filter(name => !fileName.includes(name));
      setFileName([...fileName, ...noDuplicateFiles]);
      setFiles(result.output);
    } else if (Platform.OS === "android") {
      setFiles([result.assets]);
      const selectedFileNames = result.assets.map(file => file.name);
      const noDuplicateFiles = selectedFileNames.filter(name => !fileName.includes(name));
      setFileName([...fileName, ...noDuplicateFiles]);
      setFiles(result.assets);
    }
  };

  // function deleting files that are selected by user
  const deleteFile = index => {
    const filesAfterDeletionName = fileName.filter((_name, i) => i !== index);
    setFileName(filesAfterDeletionName);  
    const filteredFiles = Array.from(files).filter(file => filesAfterDeletionName.includes(file.name));
    setFiles(filteredFiles)
  };

  // function to send uploaded files to server
  const uploadFilesHandler = async () => {
    const fileData = new FormData();
    console.log(files);
    Array.from(files).map(file => {
      console.log(file);
      fileData.append("files", file);
    });

    for (var key of fileData.entries()) {
      console.log(key[0] + ", " + key[1].name);
    }

    await fetch("http://localhost:4000/files/uploadFiles", {
      method: "POST",
      body: fileData
    })
      .then(res => console.log(res))
      .catch(err => ("Error occured", err));
  };

  return (
    // display the blue background on top of screen
    <ImageBackground source={require("../assets/backgroundCloudyBlobsFull.png")} resizeMode="cover" style={styles.container}>
      {/* display container to select file with the appropriate formats */}
      <View style={styles.containerFile}>
        <Text style={styles.selectFiles}>Select files</Text>
        <View style={{ alignItems: "center", marginTop: "0.5%" }}>
          {/* display button to upload file */}
          <TouchableOpacity testID="selectButton" onPress={fileSelectedHandler} accept=".pdf, docx, .txt">
            <ImageBackground style={styles.imageUpload} source={require("../assets/UploadDashedZoneH.png")}>
              <Text style={styles.supportedFormats}>Supported formats:{"\n"}PDF, TXT, DOCX</Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>
        <View style={styles.containerUploaded}>
          <Text style={styles.uploadFiles}>Uploads - {fileName.length} files</Text>
          {/* display rows for each uploaded file */}
          {fileName.map((name, index) => {
            const splitName = name.split(".");
            const fileType = splitName[splitName.length - 1];
            console.log(fileType);
            return (
              <View key={index}>
                <View key={index} style={[fileType == "pdf" || fileType == "doc" || fileType == "docx" || fileType == "txt" ? styles.successRowUpload : styles.errorRowUpload]}>
                  <View style={styles.rowUpload}>
                    <TextInput style={styles.errorTextbox} onChangeText={newText => setFileName(newText)} value={name} />
                    <TouchableOpacity testID="deleteButton" style={styles.buttonDelete} onPress={() => deleteFile(index)}>
                      {fileType == "pdf" || fileType == "doc" || fileType == "docx" || fileType == "txt" ? <Image style={{ height: 20, width: 20 }} source={require("../assets/bxs_x-circle.png")} /> : <Image style={{ height: 20, width: 20 }} source={require("../assets/trash.png")} />}
                    </TouchableOpacity>
                  </View>
                </View>
                {fileType == "pdf" || fileType == "doc" || fileType == "docx" || fileType == "txt" ? null : (
                  <View style={styles.errorMsgRow}>
                    <Text style={styles.errorText}>This format is not supported. Please try again.</Text>
                  </View>
                )}
              </View>
            );
          })}
          {/* display button to confirm: uploading files */}
          <View style={{ alignItems: "center", paddingLeft: "10%" }}>
            <TouchableOpacity onPress={uploadFilesHandler} style={[styles.buttonUpload, { marginTop: "3%" }, { marginBottom: "3%" }]} testID="uploadButton">
              <Text style={styles.buttonText}>
                Upload
              </Text>
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
    width: "100%",
    height: "100%"
  },
  containerFile: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    alignItems: "center",
    width: "100%",
    minHeight: "100%",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: "10%"
  },
  selectFiles: {
    color: "#696969",
    fontSize: 36,
    fontWeight: "500",
    marginTop: "1%"
  },
  imageUpload: {
    resizeMode: "contain",
    width: 221,
    height: 130
  },
  supportedFormats: {
    color: "#ADADAD",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    marginTop: "40%"
  },
  containerUploaded: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "left",
    width: "100%",
    height: "100%",
    backgroundColor: "#FAFAFA",
    paddingLeft: "5%",
    paddingRight: "13%"
  },
  uploadFiles: {
    color: "#696969",
    fontSize: 20,
    fontWeight: "500",
    marginTop: "0.5%",
    marginBottom: "0.5%"
  },
  rowUpload: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  successRowUpload: {
    borderRadius: 10,
    borderColor: '#61A750',
    borderStyle: 'solid',
    borderWidth: 1,
    marginBottom: "1%"
  },
  errorRowUpload: {
    borderRadius: 10,
    borderColor: "#F24E1E",
    borderStyle: "solid",
    borderWidth: 1
  },
  errorTextbox: {
    flex: 0.9,
    padding: 10
  },
  buttonDelete: {
    flex: 0.1,
    alignItems: "center",
    justifyContent: "center"
  },
  errorMsgRow: {
    marginBottom: "1%"
  },
  errorText: {
    color: "#F24E1E",
    fontSize: 10.76,
    fontWeight: "500"
    // lineHeight: 19.37,
  },
  buttonUpload: {
    backgroundColor: "#407BFF",
    width: 190,
    height: 35,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    padding: 8
  },
  buttonText: {
    color: "#FFFFFF",
    alignItems: "center",
    fontSize: 15,
    fontWeight: "500"
  }
});

export default EditUploadScreen;
