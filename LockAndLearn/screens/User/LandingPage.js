import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button, Platform } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { getUser } from '../../components/AsyncStorage';

const LandingPage = ({ navigation }) => {
  const [userId, setUserId] = useState(null);

  const getUserToken = async () => {
    const userToken = await getUser();
    if (userToken) {
      setUserId(userToken._id);
    }
  };

  useEffect(() => {
    getUserToken();
  }, []);

  return (
    <View style={styles.page}>
      <View>
        <TouchableOpacity
          style={styles.content}
          onPress={() => navigation.navigate('WorkPackageOverview')}
        >
          <Text style={styles.text}>My Work Packages</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.content} onPress={() => navigation.navigate('Upload')}>
          <Text style={styles.text}>Upload Study Material</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.content}
          onPress={() => navigation.navigate('QuizzesOverviewScreen', { userId: userId })}
        >
          <Text style={styles.text}>My quizzes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.content} onPress={() => navigation.navigate('ViewUploads')}>
          <Text style={styles.text}>View my files</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={styles.content}
          onPress={() => navigation.navigate('ParentAccount')}
        >
          <Text style={styles.text}>Parent Account</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    backgroundColor: '#4F85FF',
    borderRadius: 5,
    marginVertical: 10,
    paddingVertical: 20,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: wp(50),
    minHeight: hp(10),
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default LandingPage;
