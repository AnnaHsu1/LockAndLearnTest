import { useState, useEffect } from 'react';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Platform,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Modal2 from 'react-native-modal';
import { Button, Icon } from 'react-native-paper';
import { Checkbox } from 'react-native-paper';
import { getItem } from '../../components/AsyncStorage';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

const ViewUploadedFilesScreen = () => {
  // const [modalVisible, setModalVisible] = useState(false);
  let [userId, setUserId] = useState('');
  const [dataFile, setDataFile] = useState([]);
  const [fileId, setFileId] = useState('');
  const [fileName, setFileName] = useState('');
  const [deleteDataFile, setDeleteDataFile] = useState([]);
  // const [fetchedFiles, setFetchedFiles] = useState([]);
  const [modalFilterVisible, setModalFilterVisible] = useState(false);
  const [checkedboxItems, setCheckedboxItems] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);
  const [dataFilter, setDataFilter] = useState([
    { id: 1, label: 'French' },
    { id: 2, label: 'Mathematics' },
    { id: 3, label: 'Science' },
    { id: 4, label: 'History' },
    { id: 5, label: 'Biology' },
    { id: 6, label: 'English' },
  ]);

  // function to get user id from AsyncStorage
  const getUser = async () => {
    try {
      const token = await getItem('@token');
      if (token) {
        const user = JSON.parse(token);
        setUserId(user._id);
        return user._id;
      } else {
        // Handle the case where user is undefined (not found in AsyncStorage)
        console.log('User not found in AsyncStorage');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  // function called when screen is loaded
  useEffect(() => {
    fetchFiles();
  }, [deleteDataFile]);
  
  // function to fetch data from server for specific user
  const fetchFiles = async () => {
    userId = getUser();
    userId.then(async (user) => {
      userId = user;
      const response = await fetch(`http://localhost:4000/files/specificUploadFiles/${userId}`, {
        method: 'GET',
      });
      const files = await response.json();
      deleteDataFile.push(files.uploadedFiles);
      let idFileCounter = 1;
      for (let i = 0; i < files.uploadedFiles.length; i++) {
        const nameFile = files.uploadedFiles[i].filename;
        const idFile = idFileCounter++;
        const file = { id: idFile, originalname: nameFile };
        dataFile.push(file);
      }
    });

  };

  // function to toggle the pop up modal for filter section
  const toggleModalFilter = () => {
    setModalFilterVisible(!modalFilterVisible);
  };

  // function to toggle checkboxes for filter section
  // to be implemented: update "checkedboxItems" to include the checkbox with "id"
  const toggleCheckbox = (id) => {
    setCheckedboxItems((prevCheckedboxItems) => ({
      ...prevCheckedboxItems,
      [id]: !prevCheckedboxItems[id] || false,
    }));
  };

  const handleDelete = async (itemId) => {

    
    try {
      console.log("itemId: ", itemId);
      console.log(deleteDataFile[0][itemId - 1]._id)
      const response = await fetch(`http://localhost:4000/files/deleteUploadFiles/${deleteDataFile[0][itemId - 1]._id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
        console.log('File deleted successfully');
        const newData = dataFile.filter((item) => item.id !== itemId);
        // console.log("newData: ", newData)
        setDataFile(newData);
        toast.success('File deleted successfully!');
        // setDeleteDataFile(newData);
        // update the state to remove the deleted file from the UI
      } else {
        console.log('Failed to delete file');
      }
    } catch (error) {
      console.log(error);
    }
  };

  // function to download files
  const downloadFile = async (fileName) => {
    console.log(fileName);
    const response = await fetch(`http://localhost:4000/files/uploadFiles/${fileName}`, {
      method: 'GET',
    });
    
    if (response.ok) {
      const test = await response.blob();
      const url = URL.createObjectURL(test);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}`;
      a.click();
    }
  };

  const itemDeleteId = "";
  const getFileId = (itemId) => {
    itemDeleteId = itemId;
    // return itemId;
  };
  

  // function to render each row (which is a file)
  const renderFile = (file, index, totalItems) => (
    // display a row with a file name and a delete button & have a grey border at the bottom of each row (except the last row)
    <View
      style={[
        styles.row,
        index < totalItems - 1 ? { borderBottomWidth: 1, borderBottomColor: 'lightgray' } : null,
      ]}
    >
      <TouchableOpacity key={index.toString} onPress={() => downloadFile(file.originalname)}>
        <Text style={styles.originalname}>{file.originalname}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonDelete} 
        // onPress={() => {
        //   // handleDelete(file.id);
        //   setModalVisible(true);
        // }}
        onPress={() => {
          toggleModal();
          setFileId(file.id)
          setFileName(file.originalname)
        }}
      >
        <View style={styles.deleteButtonBackground}>
          <Icon source="delete-outline" size={20} color={'#F24E1E'} />
        </View>
      </TouchableOpacity>
    </View>

  );

  return (
    // display the blue background on top of screen
    <ImageBackground
      source={require('../../assets/backgroundCloudyBlobsFull.png')}
      resizeMode="cover"
      style={styles.container}
    >
      {/* display container */}
      <View style={styles.containerFile}>
        <ToastContainer
          position="top-center"
          hideProgressBar
          closeOnClick
          theme="dark"
          style={{ marginTop: '70px' }}
        />
        {/* display title */}
        <Text testID="selectFileText" style={styles.selectFiles}>
          Select files
        </Text>
        <TouchableOpacity
          style={{
            paddingRight: '15%',
            paddingBottom: '0.5%',
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
          onPress={toggleModalFilter}
        >
          <Text testID="filterPress" style={{ fontSize: 20, color: '#696969', fontWeight: '500' }}>
            Filter
          </Text>
          <Icon source="filter-outline" size={30} color={'#696969'} borderWidth={1} />
        </TouchableOpacity>
        {/* display each row (which is a file) */}        
          <FlatList
            data={dataFile}
            renderItem={({ item, index }) => renderFile(item, index, dataFile.length)}
            keyExtractor={(item) => item.id}
            style={{ width: '100%' }}
            contentContainerStyle={{ paddingHorizontal: '5%' }}
            ListEmptyComponent={() => (
              // Display when no files are uploaded
              <View style={{ alignItems: 'center', marginTop: 20 }}>
                <Text>No uploaded files</Text>
              </View>
            )}
          /> 
          {/* Pop-up: Confirmation to delete file */}
          <Modal2
            isVisible={isModalVisible}
            onRequestClose={toggleModal}
            transparent={true}
            style={styles.modalComponent}
          >
            <View
              style={styles.modalView1}
            >
              <Text style={styles.text}>
                Are you sure you want to delete {fileName}?
              </Text>
              <View style={styles.modalView}>
                <Button
                  style={styles.modalNoButton}
                  title="Hide modal"
                  mode="contained"
                  onPress={() => {
                    toggleModal();
                  }}
                >
                  <Text style={styles.modalButtonText}>No</Text>
                </Button>
                <Button
                  style={styles.modalYesButton}
                  title="Delete child"
                  mode="contained"
                  onPress={() => {
                    toggleModal();
                    handleDelete(fileId);
                  }}
                >
                  <Text style={styles.modalButtonText}>Yes</Text>
                </Button>
              </View>
            </View>
          </Modal2>
      </View>
      {/* display pop up modal for filter section */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalFilterVisible}
        onRequestClose={toggleModalFilter}
      >
        <View
          style={{
            flex: 1,
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* display button to close modal */}
          <View
            style={{
              position: 'absolute',
              top: '26.5%',
              right: '27%',
              zIndex: 1,
            }}
          >
            <TouchableOpacity onPress={toggleModalFilter}>
              <Icon source="close" size={20} color={'#696969'} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: '50%',
              height: '50%',
              backgroundColor: 'white',
              borderRadius: 10,
              paddingTop: '1%',
              paddingBottom: '1.5%',
            }}
          >
            {/* display title of modal */}
            <View
              style={{
                alignItems: 'center',
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'center',
                paddingBottom: '1%',
                borderBottomWidth: 1,
                borderBottomColor: 'lightgray',
              }}
            >
              <Text style={{ fontSize: 20, color: '#696969', fontWeight: '500' }}>Filter</Text>
              <Icon source="filter-outline" size={30} color={'#696969'} borderWidth={1} />
            </View>
            <View
              style={{
                paddingHorizontal: '4%',
                paddingTop: '3%',
                paddingBottom: '2%',
              }}
            >
              {/* display search bar */}
              {/* to be implemented function to filter search item entered by user */}
              <TextInput
                placeholder="Search"
                style={{
                  borderWidth: 1,
                  padding: '2%',
                  marginBottom: '0.5%',
                  backgroundColor: '#D9D9D9',
                  borderRadius: 10,
                  borderColor: '#D9D9D9',
                }}
              />
            </View>
            {/* display each row with checkbox and filter text */}
            <FlatList
              style={{ paddingHorizontal: '4%' }}
              data={dataFilter}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Checkbox
                    status={checkedboxItems[item.id] ? 'checked' : 'unchecked'}
                    onPress={() => toggleCheckbox(item.id)}
                  />
                  <Text>{item.label}</Text>
                </View>
              )}
            />
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  containerFile: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    width: '100%',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: '5%',
  },
  selectFiles: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '1%',
    color: '#696969',
    fontSize: 36,
    fontWeight: '500',
    // flex: 1,
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filename: {
    flex: 1,
    paddingVertical: 8,
  },
  buttonDelete: {
    padding: 8,
  },
  deleteButtonBackground: {
    backgroundColor: 'rgba(242, 78, 30, 0.13)',
    borderRadius: 100,
    padding: 5,
  },
  modalView: {
    flexDirection: 'row', 
    justifyContent: 'space-around', 
  },
  modalNoButton: {
    borderRadius: 20, 
    padding: 10, 
    elevation: 2, 
    width: '40%', 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'grey',
  },
  text: {
    color: 'black',
    fontSize: 20,
    marginBottom: 15, 
    textAlign: 'center',
  },
  modalButtons: {
    borderRadius: 10,
    marginVertical: 10,
    height: 50,
    justifyContent: 'center',
    minWidth: 100,
  },
  modalButtonText: {
    color: 'white', 
    fontWeight: 'bold', 
    textAlign: 'center', 
    fontSize: 20
  },
  modalYesButton: {
    borderRadius: 20, 
    padding: 10, 
    elevation: 2, 
    width: '40%', 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#FF4136'
  },
  modalView1: {
    margin: 20, 
    backgroundColor: 'white', 
    borderRadius: 20, 
    padding: 35, 
    alignItems: 'center', 
    shadowOpacity: 0.25, 
    shadowRadius: 4, 
    elevation: 5, 
  },
  modalComponent: { 
    justifyContent: 'center', 
    alignItems: 'center',
   },
});

export default ViewUploadedFilesScreen;
