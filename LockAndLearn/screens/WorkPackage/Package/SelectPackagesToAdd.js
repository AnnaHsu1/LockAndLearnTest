import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  FlatList,
  Dimensions,
} from 'react-native';
import { Icon, Checkbox, Button } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getItem } from '../../../components/AsyncStorage';
import Modal from 'react-native-modal';

const SelectPackagesToAdd = () => {
  const route = useRoute();
  const workPackageId = '';
  const workPackageName = '';
  const workPackageGrade = '';
  const workPackageSubcategory = '';
  const navigation = useNavigation();
  const [dataFile, setDataFile] = useState([]);
  const [deleteDataFile, setDeleteDataFile] = useState([]);
  const [checkedboxItems, setCheckedboxItems] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);
  const [fileDeleteId, setFileDeleteId] = useState('');
  const [fileDeleteName, setFileDeleteName] = useState('');
  const { width } = Dimensions.get('window');
  const maxTextWidth = width * 0.6;
  const maxTextButtonWidth = width * 0.8;

  // function to toggle delete modal
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  // function called when screen is loaded
  useEffect(() => {
    fetchFiles();
  }, [deleteDataFile]);

  // function to fetch all files from user
  const fetchFiles = async () => {
    const token = await getItem('@token');
    const user = JSON.parse(token);
    const userId = user._id;
    const response = await fetch(`http://localhost:4000/files/specificUploadFiles/${userId}`, {
      method: 'GET',
    });
    const files = await response.json();
    deleteDataFile.push(files.uploadedFiles);

    // store files to display in renderFile fct
    const formattedFiles = files.uploadedFiles.map((file, index) => ({
      id: index + 1,
      originalname: file.filename,
      originalId: file._id,
    }));
    setDataFile(formattedFiles);

    // set checked (true) to checkboxes that are already selected in the work package
    const responseWp = await fetch(`http://localhost:4000/workPackages/${workPackageId}`, {
      method: 'GET',
    });
    const selectedFiles = await responseWp.json();
    const checkedboxItems = {};
    for (var i = 0; i < selectedFiles.materials.length; i++) {
      for (var j = 0; j < formattedFiles.length; j++) {
        if (selectedFiles.materials[i] === formattedFiles[j].originalId) {
          checkedboxItems[formattedFiles[j].id] = true;
        }
      }
    }
    selectedFiles.materials.forEach((material) => {
      const index = formattedFiles.findIndex((file) => file.originalId === material);
      if (index !== -1) {
        checkedboxItems[formattedFiles[index].id] = true;
      }
    });
    setCheckedboxItems(checkedboxItems);
  };

  // function to download file
  const downloadFile = async (fileName) => {
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

  // function to check if there is any file selected: return true if there is no file selected
  const isAddButtonDisabled = () => {
    for (var key in checkedboxItems) {
      if (checkedboxItems[key] == true) {
        return false;
      }
    }
    return true;
  };

  // function to store the checked files in an array and send to database
  const handleAddFilesInWP = async () => {
    const selectedFiles = Object.entries(checkedboxItems)
      .filter(([key, value]) => value)
      .map(([key, value]) => dataFile.find((file) => file.id === parseInt(key)).originalId);

    const response = await fetch(
      `http://localhost:4000/workPackages/addMaterials/${workPackageId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          materials: selectedFiles,
        }),
      }
    );
    const files = await response.json();
    navigation.navigate('DisplayWorkPackageContent', {
      workPackageId: workPackageId,
      selectedNewContent: selectedFiles,
    });
  };

  // function to delete files
  const handleDelete = async (itemId) => {
    await fetch(
      `http://localhost:4000/files/deleteUploadFiles/${deleteDataFile[0][itemId - 1]._id}`,
      {
        method: 'DELETE',
      }
    );
    const newData = dataFile.filter((item) => item.id !== itemId);
    setDataFile(newData);
    for (var key in checkedboxItems) {
      if (key == itemId) {
        delete checkedboxItems[key];
      }
    }
  };

  // function to toggle checkbox based on the file id
  const toggleCheckbox = (file) => {
    setCheckedboxItems((prevCheckedboxItems) => ({
      ...prevCheckedboxItems,
      [file.id]: !prevCheckedboxItems[file.id] || false,
    }));
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
      <Checkbox
        status={checkedboxItems[file.id] ? 'checked' : 'unchecked'}
        onPress={() => toggleCheckbox(file)}
        color="#407BFF"
      />
      <TouchableOpacity key={index.toString} onPress={() => downloadFile(file.originalname)}>
        <Text numberOfLines={1} ellipsizeMode="middle" style={{ maxWidth: maxTextWidth }}>
          {file.originalname}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonDelete}
        onPress={() => {
          setFileDeleteId(file.id);
          setFileDeleteName(file.originalname);
          setModalVisible(true);
        }}
      >
        <View style={styles.deleteButtonBackground}>
          <Icon source="delete-outline" size={20} color={'#F24E1E'} />
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <ImageBackground
      source={require('../../../assets/backgroundCloudyBlobsFull.png')}
      resizeMode="cover"
      style={styles.container}
    >
      <View style={styles.containerFile}>
        <View style={styles.containerTitle}>
          <Text style={styles.selectFiles}>Subject - Grade</Text>
          <Text style={styles.selectFiles}>Choose packages to add to your Work Package:</Text>
          <Text style={styles.workPackageTitle}>
            {workPackageName} - {workPackageGrade}
          </Text>
          {workPackageSubcategory !== 'Choose a Subcategory' && (
            <Text style={styles.workPackageInfo}>{workPackageSubcategory}</Text>
          )}
        </View>
        {/* display button to navigate to screen to upload files */}
        <View style={styles.buttonAddStudyMaterial}>
          <TouchableOpacity onPress={() => navigation.navigate('Upload')}>
            <Text style={{ color: '#407BFF', fontSize: 15 }}>+ Add Study Material</Text>
          </TouchableOpacity>
        </View>
        {/* display each row (which is a file) */}
        <FlatList
          data={dataFile}
          renderItem={({ item, index }) => renderFile(item, index, dataFile.length)}
          keyExtractor={(item) => item.id}
          style={{ width: '100%' }}
          contentContainerStyle={{ paddingHorizontal: '5%' }}
          ListEmptyComponent={() => (
            // display when no files are found
            <View style={{ alignItems: 'center', marginTop: 20 }}>
              <Text>No files</Text>
            </View>
          )}
        />
        {/* display delete modal */}
        <Modal
          isVisible={isModalVisible}
          onRequestClose={toggleModal}
          transparent={true}
          style={{ justifyContent: 'center', alignItems: 'center' }}
        >
          <View style={styles.containerModal}>
            <Text style={styles.title}>Are you sure you want to delete?</Text>
            <Text
              numberOfLines={2}
              ellipsizeMode="middle"
              style={[styles.fileName, { maxWidth: maxTextButtonWidth }]}
            >
              {fileDeleteName}
            </Text>

            <View style={styles.containerModalButtons}>
              <Button
                style={[styles.button, { backgroundColor: 'red', marginRight: 20 }]}
                title="Hide modal"
                onPress={() => {
                  toggleModal();
                  handleDelete(fileDeleteId);
                }}
              >
                <Text style={styles.close}>Delete</Text>
              </Button>
              <Button
                style={[styles.button, { backgroundColor: 'grey' }]}
                title="Hide modal"
                onPress={() => {
                  toggleModal();
                }}
              >
                <Text style={styles.close}>Cancel</Text>
              </Button>
            </View>
          </View>
        </Modal>
        {/* display button to add selected files to add to work package */}
        {dataFile.length === 0 ? null : (
          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => handleAddFilesInWP()}
              style={[styles.buttonAddMaterial, isAddButtonDisabled() && styles.disabledButton]}
              disabled={isAddButtonDisabled()}
            >
              <Text style={styles.buttonText}>Add to Work Package</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  buttonAddStudyMaterial: {
    alignSelf: 'flex-end',
    marginRight: '5%',
    marginBottom: 5,
    marginTop: 5,
  },
  containerTitle: {
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1,
    textAlign: 'center',
    alignSelf: 'center',
    paddingBottom: 5,
    width: '100%',
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
    color: '#696969',
    fontSize: 28,
    fontWeight: '500',
    textAlign: 'center',
    padding: '1%',
  },
  workPackageTitle: {
    color: '#696969',
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center',
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonDelete: {
    padding: 8,
  },
  deleteButtonBackground: {
    backgroundColor: 'rgba(242, 78, 30, 0.13)',
    borderRadius: 100,
    padding: 5,
  },
  buttonAddMaterial: {
    backgroundColor: '#407BFF',
    width: 190,
    height: 35,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    marginTop: '2%',
    marginBottom: '3%',
  },
  buttonText: {
    color: '#FFFFFF',
    alignItems: 'center',
    fontSize: 15,
    fontWeight: '500',
  },
  containerModal: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
  },
  containerModalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: 'black',
    fontSize: 18,
    textAlign: 'center',
    paddingBottom: 20,
  },
  fileName: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
    paddingBottom: 30,
  },
  button: {
    color: '#ffffff',
    backgroundColor: '#4F85FF',
    borderRadius: 10,
    width: 100,
  },
  close: {
    color: 'white',
  },
  workPackageInfo: {
    color: '#696969',
    fontSize: 23,
    fontWeight: '500',
    textAlign: 'center',
    alignSelf: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});

export default SelectPackagesToAdd;
