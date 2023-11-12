import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/User/LoginScreen';
import UploadScreen from '../screens/StudyMaterial/UploadScreen';
import SignupScreen from '../screens/User/SignupScreen';
import LockingSessionBeginsScreen from '../screens/Locking/LockingSessionBeginsScreen';
import LockingSchedulePresentation from '../screens/Locking/LockingSchedulePresentation';
import StudyMaterial from '../screens/StudyMaterial/StudyMaterial';
import LandingPage from '../screens/User/LandingPage';
import SelectWorkPackageScreen from '../screens/QuizMaterial/SelectWorkPackageScreen';
import QuestionsOverviewScreen from '../screens/QuizMaterial/QuestionsOverviewScreen';
import QuizzesOverviewScreen from '../screens/QuizMaterial/QuizzesOverviewScreen';
import CreateQuestion from '../screens/QuizMaterial/CreateQuestion';
import EditQuestion from '../screens/QuizMaterial/EditQuestion';
import ParentAccount from '../screens/User/Child/ParentAccountScreen';
import AddChild from '../screens/User/Child/AddChildScreen';
import ViewUploadedFilesScreen from '../screens/StudyMaterial/ViewUploadedFilesScreen';
import GoogleSignUpScreen from '../screens/User/GoogleSignUpScreen';

const Stack = createNativeStackNavigator();

const StackNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Lock & Learn', 
          headerShown: false }}
        />
        <Stack.Screen
          name="Login" 
          component={LoginScreen} 
          options={{ title: 'Login' }} 
          />
        <Stack.Screen 
          name="Signup" 
          component={SignupScreen} 
          options={{ title: 'Sign up' }} 
          />
        <Stack.Screen
          name="Upload"
          component={UploadScreen}
          options={{ title: 'Upload Study Material' }}
        />
        <Stack.Screen
          name="Locking"
          component={LockingSessionBeginsScreen}
          options={{ title: 'Locking' }}
        />
        <Stack.Screen
          name="LockingSchedulePresentation"
          component={LockingSchedulePresentation}
          options={{ title: 'LockingSchedulePresentation' }}
        />
        <Stack.Screen
          name="StudyMaterial"
          component={StudyMaterial}
          options={{ title: 'StudyMaterial' }}
        />
        <Stack.Screen
          name="UserLandingPage"
          component={LandingPage}
          options={({ navigation }) => ({
            title: 'Landing Page',
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Home');
                    }}
                style={{ marginLeft: 15 }}
              >
                <Ionicons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="ParentAccount"
          component={ParentAccount}
          options={({ navigation }) => ({
            title: 'Manage Children',
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('UserLandingPage');
                    }}
                style={{ marginLeft: 15 }}
              >
                <Ionicons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="AddChild"
          component={AddChild}
          options={{ title: 'Add Child Account' }}
        />
        <Stack.Screen
          name="ViewUploads"
          component={ViewUploadedFilesScreen}
          options={{ title: 'View my Uploaded Files' }}
        />
        <Stack.Screen
          name="SelectWorkPackageScreen"
          component={SelectWorkPackageScreen}
          options={{ title: 'Select WorkPackage' }}
        />
        <Stack.Screen
          name="QuizzesOverviewScreen"
          component={QuizzesOverviewScreen}
          options={{ title: 'Quizzes Overview' }}
        />
        <Stack.Screen
          name="QuestionsOverviewScreen"
          component={QuestionsOverviewScreen}
          options={{ title: 'Questions Overview' }}
        />
        <Stack.Screen
          name="CreateQuestion"
          component={CreateQuestion}
          options={{ title: 'Create Question' }}
        />
        <Stack.Screen
          name="GoogleSignUp"
          component={GoogleSignUpScreen}
          options={{ title: 'Google Sign Up' }}
        />
        <Stack.Screen
          name="EditQuestion"
          component={EditQuestion}
          options={{ title: 'EditQuestion' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  headerLink: {
    color: 'blue', // Customize the link color as needed
    textDecorationLine: 'underline', // Underline to indicate it's a link
    marginLeft: 16, // Add some spacing from the back button
  },
});

export default StackNavigation;
