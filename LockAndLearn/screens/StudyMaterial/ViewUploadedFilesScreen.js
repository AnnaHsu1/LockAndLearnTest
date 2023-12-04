import { useState, useEffect } from 'react';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { Button, Icon } from 'react-native-paper';
import { Checkbox } from 'react-native-paper';
import { getItem } from '../../components/AsyncStorage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import * as pdfjsLib from 'pdfjs-dist/webpack';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { useNavigation, useRoute } from '@react-navigation/native';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const ViewUploadedFilesScreen = () => {
  let [userId, setUserId] = useState('');
  const [dataFile, setDataFile] = useState([]);
  const [fileId, setFileId] = useState('');
  const [fileName, setFileName] = useState('');
  const [deleteDataFile, setDeleteDataFile] = useState([]);
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
  const [pdf, setPdf] = useState(null);
  const newPlugin = defaultLayoutPlugin({
    innerContainer: styles.customInnerContainer,
  });
  const { width } = Dimensions.get('window');
  const maxDeleteTextWidth = width * 0.8;
  const maxTextWidth = width * 0.7;
  const maxDescriptionTextWidth = width * 0.7;
  const navigation = useNavigation();
  const route = useRoute();
  let newContentAdded = route.params.newFilesAdded;

  // function to get user id from AsyncStorage
  const getUser = async () => {
    try {
      const token = await getItem('@token');
      if (token) {
        const user = JSON.parse(token);
        setUserId(user._id);
      } else {
        // Handle the case where user is undefined (not found in AsyncStorage)
        console.log('User not found in AsyncStorage');
      }
    } catch (error) {
      console.log(error);
    }
  };

  // function to toggle the pop up delete modal
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  // function called when screen is loaded
  useEffect(() => {
    getUser();
  }, []);

  // function called when userId or newContentAdded is updated
  useEffect(() => {
    fetchFiles();
  }, [userId, newContentAdded]);

  // function to fetch files from server for specific user
  const fetchFiles = async () => {
    // ensure no duplicate files are displayed
    setDataFile([]);
    setDeleteDataFile([]);
    if (userId) {
      try {
        const response = await fetch(`http://localhost:4000/files/specificUploadFiles/${userId}`, {
          method: 'GET',
        });
        const files = await response.json();
        setDeleteDataFile(files.uploadedFiles);
        setDataFile(prevDataFile => [
          ...prevDataFile,
          ...files.uploadedFiles.map((file, index) => ({
              id: 1 + index,
              originalname: file.filename,
              description: file.metadata.description,
          }))
        ]);
      }
      catch (error) {
        console.log(error);
      };
    };
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

  // function to delete selected file
  const handleDelete = async (itemId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/files/deleteUploadFiles/${deleteDataFile[itemId - 1]._id}`,
        {
          method: 'DELETE',
        }
      );
      if (response.ok) {
        console.log('File deleted successfully');
        const newData = dataFile.filter((item) => item.id !== itemId);
        setDataFile(newData);
        toast.success('File deleted successfully!');
        // setDeleteDataFile(newData);
      } else {
        console.log('Failed to delete file');
      }
    } catch (error) {
      console.log(error);
    }
  };

  // function to display files
  const displayFile = async (fileName) => {
    const response = await fetch(`http://localhost:4000/files/uploadFiles/${fileName}`, {
      method: 'GET',
    });

    if (response.ok) {
      const test = await response.blob();
      const url = URL.createObjectURL(test);
      setPdf(url);

      // Display file within the page
      // const loadingTask = pdfjsLib.getDocument(url);

      // const pageDisplay = document.createElement('div');

      // loadingTask.promise.then(async function (pdf) {
      //   for (let page = 1; page <= pdf.numPages; page++) {
      //     const pdfPage = await pdf.getPage(page);
      //     const viewport = pdfPage.getViewport({ scale: 1 });

      //     const canvas = document.createElement('canvas');
      //     const context = canvas.getContext('2d');
      //     canvas.height = viewport.height;
      //     canvas.width = viewport.width;

      //     const renderContext = {
      //       canvasContext: context,
      //       viewport: viewport,
      //     };

      //     await pdfPage.render(renderContext).promise;

      //     pageDisplay.appendChild(canvas);
      //   }
      //   const pdfDisplay = document.getElementById('pdfDisplay');
      //   pdfDisplay.innerHTML = '';
      //   pdfDisplay.appendChild(pageDisplay);
      // });
    }
    // Display the file on a new window
    // if (response.ok) {
    //   const test = await response.blob();
    //   const url = URL.createObjectURL(test);
    //   const loadingTask = pdfjsLib.getDocument(url);
    //   loadingTask.promise.then(function (pdf) {
    //   const newWindow = window.open();
    //     for (let page = 1; page <= pdf.numPages; page++) {
    //       pdf.getPage(page).then(function (pdfPage) {
    //         const viewport = pdfPage.getViewport({ scale: 1 });
    //         const canvas = document.getElementById('canvas');
    //         const context = canvas.getContext('2d');
    //         canvas.height = viewport.height;
    //         canvas.width = viewport.width;
    //         const renderContext = {
    //           canvasContext: context,
    //           viewport: viewport,
    //         };
    //         pdfPage.render(renderContext).promise.then(function () {
    //            const newUrl = canvas.toDataURL();
    //            newWindow.document.write(
    //              "<iframe width='100%' height='100%' src='" + newUrl + "'></iframe>"
    //            );
    //          });
    //       });
    //     }
    //   });
    // }
  };

  const itemDeleteId = '';
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
      <TouchableOpacity
        key={index.toString()}
        onPress={() => displayFile(file.originalname)}
        testID={`fileTouchableOpacity-${index}`}
      >
        <Text numberOfLines={1} ellipsizeMode='middle' style={{ maxWidth: maxTextWidth, marginTop: 5 }}>{file.originalname}</Text>
        <Text numberOfLines={2} ellipsizeMode='middle' style={[styles.fileDescriptionText, {maxWidth: maxDescriptionTextWidth}]}>{file.description}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonDelete}
        testID={`deleteButton-${index}`}
        onPress={() => {
          toggleModal();
          setFileId(file.id);
          setFileName(file.originalname);
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
          style={styles.buttonFilter}
          onPress={toggleModalFilter}
          testID="openingFilter"
        >
          <Text testID="filterPress" style={styles.filterText}>
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
        {/* display button to upload files */}
          <TouchableOpacity
            style={styles.buttonUploadFiles}
            onPress={() => {
              navigation.navigate('Upload');
            }}
          >
            <Text style={styles.textUploadFiles}>Upload files</Text>
          </TouchableOpacity>
        {/* display the preview file */}
        {pdf && (
          <View
            style={styles.pdfViewContainer}
          >
            <View style={styles.pdfContainer}>
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.0.279/build/pdf.worker.min.js">
                <Viewer fileUrl={pdf} plugins={[newPlugin]} defaultScale={1} />
              </Worker>
            </View>
            <Button
              style={styles.modalButtons}
              title="Hide modal"
              mode="contained"
              onPress={() => {
                setPdf(null);
              }}
            >
              <Text>Cancel</Text>
            </Button>
          </View>
        )}
        {/* Pop-up: Confirmation to delete file */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={toggleModal}
        >
          {/* display modal's background */}
          <View style={styles.modalContainer}>
            {/* display modal */}
            <View style={styles.modalView1}>
              <Text style={styles.text}>Are you sure you want to delete</Text>
              <Text numberOfLines={2} ellipsizeMode='middle' style={[styles.textName, { width: maxDeleteTextWidth }]}>{fileName} ?</Text>
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
          </View>
        </Modal>
      </View >
      {/* display pop up modal for filter section */}
      < Modal
        animationType="slide"
        transparent={true}
        visible={modalFilterVisible}
        onRequestClose={toggleModalFilter}
      >
        <View style={styles.modalContainerFilter}>
          {/* display button to close modal */}
          <View style={styles.containerButtonCloseModal}>
            <TouchableOpacity onPress={toggleModalFilter}>
              <Icon source="close" size={20} color={'#696969'} />
            </TouchableOpacity>
          </View>
          <View
            style={styles.containerContentModalFilter}
          >
            {/* display title of modal */}
            <View
              style={styles.containerFilterTextTitle}
            >
              <Text style={styles.filterTextTitle}>Filter</Text>
              <Icon source="filter-outline" size={30} color={'#696969'} borderWidth={1} />
            </View>
            <View
              style={styles.containerSearchBar}
            >
              {/* display search bar */}
              {/* to be implemented function to filter search item entered by user */}
              <TextInput
                placeholder="Search"
                style={styles.textInputSearch}
              />
            </View>
            {/* display each row with checkbox and filter text */}
            <FlatList
              style={{ paddingHorizontal: '4%' }}
              data={dataFilter}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.checkedboxItemsContainer}>
                  <Checkbox
                    status={checkedboxItems[item.id] ? 'checked' : 'unchecked'}
                    onPress={() => toggleCheckbox(item.id)}
                    testID={`checkbox-${item.id}`}
                  />
                  <Text>{item.label}</Text>
                </View>
              )}
            />
          </View>
        </View>
      </Modal >
    </ImageBackground >
  );
};

const styles = StyleSheet.create({
  checkedboxItemsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInputSearch: {
    borderWidth: 1,
    padding: '2%',
    marginBottom: '0.5%',
    backgroundColor: '#D9D9D9',
    borderRadius: 10,
    borderColor: '#D9D9D9',
  },
  containerSearchBar: {
    paddingHorizontal: '4%',
    paddingTop: '3%',
    paddingBottom: '2%',
  },
  filterTextTitle: {
    fontSize: 20,
    color: '#696969',
    fontWeight: '500'
  },
  containerFilterTextTitle: {
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: '1%',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  containerContentModalFilter: {
    width: '50%',
    height: '50%',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingTop: '1%',
    paddingBottom: '1.5%',
  },
  containerButtonCloseModal: {
    position: 'absolute',
    top: '26.5%',
    right: '27%',
    zIndex: 1,
  },
  modalContainerFilter: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  textUploadFiles: {
    color: '#FFFFFF',
    alignItems: 'center',
    fontSize: 15,
    fontWeight: '500'
  },
  buttonUploadFiles: {
    width: 190,
    height: 35,
    backgroundColor: '#407BFF',
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '2%',
    marginBottom: '2%'
  },
  filterText: {
    fontSize: 20,
    color: '#696969',
    fontWeight: '500'
  },
  buttonFilter: {
    paddingRight: '15%',
    paddingBottom: '0.5%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
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
    // height: '100%',
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
    marginTop: 10,
  },
  text: {
    color: 'black',
    fontSize: 18,
    paddingBottom: 10,
    textAlign: 'center',
  },
  textName: {
    color: 'black',
    fontSize: 16,
    paddingBottom: 45,
    textAlign: 'center',
  },
  modalButtons: {
    borderRadius: 10,
    marginVertical: 10,
    height: 50,
    justifyContent: 'center',
    minWidth: 100,
    backgroundColor: '#407BFF',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
  },
  modalNoButton: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    width: '20%',
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'grey',
  },
  modalYesButton: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    width: '20%',
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF4136',
  },
  modalContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalView1: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: 250,
    height: 200,
  },
  modalComponent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdfViewContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#FAFAFA"
  },
  pdfContainer: {
    width: '75%',
    overflowY: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingTop: 20,
  },
  fileDescriptionText: {
    color: '#696969',
     marginBottom: 5
  },
});

export default ViewUploadedFilesScreen;
