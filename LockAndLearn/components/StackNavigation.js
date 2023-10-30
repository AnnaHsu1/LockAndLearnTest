import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/User/LoginScreen';
import UploadScreen from '../screens/StudyMaterial/UploadScreen';
import SignupScreen from '../screens/User/SignupScreen';
import LockingSessionBeginsScreen from '../screens/Locking/LockingSessionBeginsScreen';
import LockingSchedulePresentation from '../screens/Locking/LockingSchedulePresentation';
import StudyMaterial from '../screens/StudyMaterial/StudyMaterial';
import LandingPage from '../screens/User/LandingPage';
import ParentAccount from '../screens/User/Child/ParentAccountScreen';
import AddChild from '../screens/User/Child/AddChildScreen';
import ViewUploadedFilesScreen from '../screens/StudyMaterial/ViewUploadedFilesScreen';

const Stack = createNativeStackNavigator();

const StackNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Lock & Learn', headerShown: false }}
        />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{ title: 'Sign up' }} />
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
          options={{ title: 'Landing Page' }}
        />
        <Stack.Screen
          name="ParentAccount"
          component={ParentAccount}
          options={{ title: 'Manage children' }}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigation;
