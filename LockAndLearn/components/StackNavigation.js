import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Text, TouchableOpacity, StyleSheet, } from 'react-native';
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
import CreateQuiz from '../screens/QuizMaterial/CreateQuiz';
import QuestionsOverviewScreen from '../screens/QuizMaterial/QuestionsOverviewScreen';
import QuizzesOverviewScreen from '../screens/QuizMaterial/QuizzesOverviewScreen';
import CreateQuestion from '../screens/QuizMaterial/CreateQuestion';
import EditQuestion from '../screens/QuizMaterial/EditQuestion';
import ParentAccount from '../screens/User/Child/ParentAccountScreen';
import AddChild from '../screens/User/Child/AddChildScreen';
import ViewUploadedFilesScreen from '../screens/StudyMaterial/ViewUploadedFilesScreen';
import WorkPackageOverview from '../screens/WorkPackage/WorkPackageOverview';
import CreateWorkPackage from '../screens/WorkPackage/CreateWorkPackage';
import DisplayWorkPackageContent from '../screens/WorkPackage/DisplayWorkPackageContent';
import SelectQuizToAdd from '../screens/WorkPackage/Quiz/SelectQuizToAdd';
import SelectStudyMaterialToAdd from '../screens/WorkPackage/StudyMaterial/SelectStudyMaterialToAdd';
import ChildProfileScreen from '../screens/User/Child/ChildProfileScreen';
import EditChildScreen from '../screens/User/Child/EditChildProfileScreen';
import GoogleSignUpScreen from '../screens/User/GoogleSignUpScreen';
import LogoutButton from './LogoutButton';
import AdminMenu from '../screens/User/Admin/AdminMenu';
import AdminAccount from '../screens/User/Admin/AdminAccounts';
import AdminFinances from '../screens/User/Admin/AdminFinances';
import AdminWorkPackages from '../screens/User/Admin/AdminWorkPackages';
import AdminFiles from '../screens/User/Admin/AdminFiles';
import AdminQuizzes from '../screens/User/Admin/AdminQuizzes';
import AdminSubcategories from '../screens/User/Admin/AdminSubcategories';
import AddChildMaterial from '../screens/User/Child/AssignChildMaterial';
import PurchasedMaterial from '../screens/User/Child/ViewPurchasedMaterial';
import WorkPackageBrowsing from '../screens/WorkPackage/WorkPackageBrowsing';
import WorkPackageCart from '../screens/WorkPackage/WorkPackageCart';
import TakeQuiz from '../screens/StudyMaterial/TakeQuiz';
import DisplayQuizzScreen from '../screens/StudyMaterial/DisplayQuizzScreen';
import QuizGradeScreen from '../screens/StudyMaterial/QuizGradeScreen';



const Stack = createNativeStackNavigator();

const StackNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#4F85FF',
            textAlign: 'center',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerRight: () => <LogoutButton />,
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Lock & Learn', headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Login', headerRight: () => null }}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{ title: 'Sign up', headerRight: () => null }}
        />
        <Stack.Screen
          name="Upload"
          component={UploadScreen}
          options={{ title: 'Upload Study Material' }}
        />
        <Stack.Screen
          name="Locking"
          component={LockingSessionBeginsScreen}
          options={{ title: 'Locking', headerShown: false }}
        />
        <Stack.Screen
          name="LockingSchedulePresentation"
          component={LockingSchedulePresentation}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="StudyMaterial"
          component={StudyMaterial}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UserLandingPage"
          component={LandingPage}
          options={({ navigation }) => ({
            title: 'Lock And Learn',
            headerLeft: () => null,
            // headerLeft: () => (
            //   <TouchableOpacity
            //     onPress={() => {
            //       navigation.navigate('Home');
            //         }}
            //     style={{ marginLeft: 15 }}
            //   >
            //     <Ionicons name="arrow-back" size={24} color="black" />
            //   </TouchableOpacity>
            // ),
          })}
        />
        <Stack.Screen
          name="ParentAccount"
          component={ParentAccount}
          options={({ navigation }) => ({
            title: 'Lock And Learn',
            headerLeft: () => null,
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
        <Stack.Screen name="CreateQuiz" component={CreateQuiz} options={{ title: 'CreateQuiz' }} />
        <Stack.Screen
          name="QuizzesOverviewScreen"
          component={QuizzesOverviewScreen}
          options={{ title: 'Quizzes' }}
        />
        <Stack.Screen
          name="QuestionsOverviewScreen"
          component={QuestionsOverviewScreen}
          options={{ title: 'Questions' }}
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
          name="WorkPackageOverview"
          component={WorkPackageOverview}
          options={{ title: 'Work Package Overview' }}
        />
        <Stack.Screen
          name="CreateWorkPackage"
          component={CreateWorkPackage}
          options={{ title: 'Create Work Package' }}
        />
        <Stack.Screen
          name="DisplayWorkPackageContent"
          component={DisplayWorkPackageContent}
          options={{ title: 'Display Work Package Content' }}
        />
        <Stack.Screen
          name="SelectQuizToAdd"
          component={SelectQuizToAdd}
          options={{ title: 'Select Quiz To Add' }}
        />
        <Stack.Screen
          name="SelectStudyMaterialToAdd"
          component={SelectStudyMaterialToAdd}
          options={{ title: 'Select Study Material To Add' }}
        />
        <Stack.Screen
          name="ChildProfile"
          component={ChildProfileScreen}
          options={{ title: 'Child Profile' }}
        />
        <Stack.Screen
          name="EditChild"
          component={EditChildScreen}
          options={{ title: 'Edit Child' }}
        />
        <Stack.Screen
          name="EditQuestion"
          component={EditQuestion}
          options={{ title: 'Edit Question' }}
        />
        <Stack.Screen
          name="AdminMenu"
          component={AdminMenu}
          options={{ title: 'AdminMenu' }}
        />
        <Stack.Screen
          name="AdminAccount"
          component={AdminAccount}
          options={{ title: 'AdminAccount' }}
        />
        <Stack.Screen
          name="AdminFinances"
          component={AdminFinances}
          options={{ title: 'AdminFinances' }}
        />
        <Stack.Screen
          name="AdminWorkPackages"
          component={AdminWorkPackages}
          options={{ title: 'AdminWorkPackages' }}
        />
        <Stack.Screen
          name="AdminFiles"
          component={AdminFiles}
          options={{ title: 'AdminFiles' }}
        />
        <Stack.Screen
          name="AdminQuizzes"
          component={AdminQuizzes}
          options={{ title: 'AdminQuizzes' }}
        />
        <Stack.Screen
          name="AdminSubcategories"
          component={AdminSubcategories}
          options={{ title: 'AdminSubcategories' }}
        /> 
        <Stack.Screen       
            name="AddChildMaterial"
            component={AddChildMaterial}
            options={{ title: 'Add Child Material' }}
        />
        <Stack.Screen
            name="PurchasedMaterial"
            component={PurchasedMaterial}
            options={{ title: 'View Purchased Material' }}
        />
        <Stack.Screen
          name="WorkPackageBrowsing"
          component={WorkPackageBrowsing}
          options={{ title: 'Work Package Browsing' }}
        />
        <Stack.Screen
            name="WorkPackageCart"
            component={WorkPackageCart}
            options={({ navigation, route }) => ({
              title: 'Work Package Cart',
               headerLeft: () => (
                 <TouchableOpacity
                 onPress={() => {
                  const removedWP = route.params || [];
                  //console.log('stack navigator', removedWP);
                  navigation.navigate('WorkPackageBrowsing', {
                    removedWP: removedWP, // Pass accumulated removed work packages as a parameter
          });
                }}
                   style={{ marginLeft: 15 }}
                 >
                   <Ionicons name="arrow-back" size={24} color="white" />
                 </TouchableOpacity>
               ),
            })}
        />
        <Stack.Screen
          name="TakeQuiz"
          component={TakeQuiz}
          options={{ title: 'Take Quiz' }}
        />
        <Stack.Screen
          name="DisplayQuizzScreen"
          component={DisplayQuizzScreen}
          options={{ title: 'Display Quiz Screen' }}
        />
        <Stack.Screen
          name="QuizGradeScreen"
          component={QuizGradeScreen}
          options={{ title: 'Quiz Grade Screen' }}
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
