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
import FreeTimeSession from '../screens/Locking/FreeTimeSessionScreen';
import StudyMaterial from '../screens/StudyMaterial/StudyMaterial';
import LandingPage from '../screens/User/LandingPage';
import CreateQuiz from '../screens/QuizMaterial/CreateQuiz';
import QuestionsOverviewScreen from '../screens/QuizMaterial/QuestionsOverviewScreen';
import QuizzesOverviewScreen from '../screens/QuizMaterial/QuizzesOverviewScreen';
import CreateQuestion from '../screens/QuizMaterial/CreateQuestion';
import EditQuestion from '../screens/QuizMaterial/EditQuestion';
import ParentAccount from '../screens/User/Child/ParentAccountScreen';
import ParentHomeScreen from '../screens/User/ParentHomeScreen';
import AddChild from '../screens/User/Child/AddChildScreen';
import ViewUploadedFilesScreen from '../screens/StudyMaterial/ViewUploadedFilesScreen';
import CreateWorkPackage from '../screens/WorkPackage/CreateWorkPackage';
import SelectQuizToAdd from '../screens/WorkPackage/Package/SelectQuizToAdd';
import SelectStudyMaterialToAdd from '../screens/WorkPackage/Package/SelectStudyMaterialToAdd';
import ChildProfileScreen from '../screens/User/Child/ChildProfileScreen';
import EditChildScreen from '../screens/User/Child/EditChildProfileScreen';
import GoogleSignUpScreen from '../screens/User/GoogleSignUpScreen';
import LogoutButton from './LogoutButton';
import CreatePackage from '../screens/WorkPackage/Package/CreatePackage';
import PackageOverview from '../screens/WorkPackage/Package/PackageOverview';
import EditPackage from '../screens/WorkPackage/Package/EditPackage';
import WorkPackage from '../screens/WorkPackage/WorkPackage';
import EditWorkPackage from '../screens/WorkPackage/EditWorkPackage';
import AdminMenu from '../screens/User/Admin/AdminMenu';
import AdminAccount from '../screens/User/Admin/AdminAccounts';
import AdminFinances from '../screens/User/Admin/AdminFinances';
import AdminWorkPackages from '../screens/User/Admin/AdminWorkPackages';
import AdminFiles from '../screens/User/Admin/AdminFiles';
import AdminQuizzes from '../screens/User/Admin/AdminQuizzes';
import AdminSubcategories from '../screens/User/Admin/AdminSubcategories';
import AddChildMaterial from '../screens/User/Child/AssignChildMaterial';
import AdminReportCenter from '../screens/User/Admin/AdminReportCenter';
import PurchasedMaterial from '../screens/User/Child/ViewPurchasedMaterial';
import WorkPackageBrowsing from '../screens/WorkPackage/WorkPackageBrowsing';
import WorkPackageCart from '../screens/WorkPackage/Payment/WorkPackageCart';
import DisplayQuizzScreen from '../screens/StudyMaterial/DisplayQuizzScreen';
import QuizGradeScreen from '../screens/StudyMaterial/QuizGradeScreen';
import AdminPackages from '../screens/User/Admin/AdminPackages';
import StudyMaterialPreferences from '../screens/User/Child/StudyMaterialPreferences';
import ChildSettings from '../screens/User/Child/ChildSettings';
import ChildPassingGradePerSubject from '../screens/User/Child/ChildPassingGradePerSubject';
import PurchaseSuccessPage from '../screens/WorkPackage/Payment/PurchaseSuccessPage';
import Payment from '../screens/WorkPackage/Payment/Payment';
import CheckoutForm from '../screens/WorkPackage/Payment/CheckoutForm';
import AdminCertificates from '../screens/User/Admin/AdminCertificates';
import DisplayStudyMaterial from '../screens/StudyMaterial/DisplayStudyMaterial';
import WorkPackagePreview from '../screens/WorkPackage/Preview/WorkPackagePreview';
import PackagePreview from '../screens/WorkPackage/Preview/PackagePreview';
import ChildTimeframes from '../screens/User/Child/ChildTimeframes';
import AdminViewTeacherProfile from '../screens/User/Admin/AdminViewTeacherProfile';
import SuspendedUser from '../screens/User/SuspendedUser';
import TutorImageUploadScreen from '../screens/User/TutorImageUploadScreen';
import FinanceInstructor from '../screens/WorkPackage/Payment/FinanceInstructor';
import ForgotCredentials from '../screens/User/ForgotCredentials';
import ResetCredentials from '../screens/User/ResetCredentials';

const Stack = createNativeStackNavigator();

const linking = {
  prefixes: ['https://localhost:19006/', 'https://lockandlearn.com', 'lockandlearn://'],

  config: {
    screens: {
      ResetCredentials: 'forgotPassword/:email',
    },
  },
};

const StackNavigation = () => {
  return (
    <NavigationContainer linking={linking}>
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
          name="FreeTimeSession"
          component={FreeTimeSession}
          options={{ title: 'FreeTimeSession', headerShown: false }}
        />
        <Stack.Screen
          name="StudyMaterial"
          component={StudyMaterial}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TutorImageUpload"
          component={TutorImageUploadScreen}
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
          name="ParentHomeScreen"
          component={ParentHomeScreen}
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
          name="PurchaseSuccessPage"
          component={PurchaseSuccessPage}
          options={{ headerShown: false }}
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
          name="CreateWorkPackage"
          component={CreateWorkPackage}
          options={{ title: 'Create Work Package' }}
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
          name="CreatePackage"
          component={CreatePackage}
          options={{ title: 'Create Package' }}
        />
        <Stack.Screen
          name="PackageOverview"
          component={PackageOverview}
          options={({ navigation }) => ({
            title: 'Package Overview',
            headerLeft: () => (
              <TouchableOpacity
                style={{ marginHorizontal: 11, marginVertical: 3 }}
                onPress={() => {
                  navigation.navigate('WorkPackage', { edited: Date.now() }); // refreshes the work package screen
                }}
              >
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="EditPackage"
          component={EditPackage}
          options={{ title: 'Edit Package' }}
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
          name="WorkPackage"
          component={WorkPackage}
          options={{ title: 'My work packages' }}
        />
        <Stack.Screen name="AdminMenu" component={AdminMenu} options={{ title: 'AdminMenu' }} />
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
          name="AdminReportCenter"
          component={AdminReportCenter}
          options={{ title: 'AdminReportCenter' }}
        />
        <Stack.Screen
          name="AdminWorkPackages"
          component={AdminWorkPackages}
          options={{ title: 'AdminWorkPackages' }}
        />
        <Stack.Screen name="AdminFiles" component={AdminFiles} options={{ title: 'AdminFiles' }} />
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
          name="AdminCertificates"
          component={AdminCertificates}
          options={{ title: 'AdminCertificates' }}
        />
        <Stack.Screen
          name="AdminPackages"
          component={AdminPackages}
          options={{ title: 'AdminPackages' }}
        />
        <Stack.Screen
          name="AddChildMaterial"
          component={AddChildMaterial}
          options={{ title: 'Add Child Workpackage' }}
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
          name="FinanceInstructor"
          component={FinanceInstructor}
          options={{ title: 'Finance Instructor' }}
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
          name="EditWorkPackage"
          component={EditWorkPackage}
          options={{ title: 'Edit work package' }}
        />
        <Stack.Screen
          name="DisplayStudyMaterial"
          component={DisplayStudyMaterial}
          options={{ title: 'Display Study Material' }}
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
        <Stack.Screen
          name="StudyMaterialPreferences"
          component={StudyMaterialPreferences}
          options={{ title: 'Study Material Preferences' }}
        />
        <Stack.Screen
          name="ChildSettings"
          component={ChildSettings}
          options={{ title: 'Child Settings' }}
        />
        <Stack.Screen
          name="ChildPassingGradePerSubject"
          component={ChildPassingGradePerSubject}
          options={{ title: 'Passing Grade Per Subject' }}
        />
        <Stack.Screen name="Payment" component={Payment} options={{ title: 'Payment' }} />
        <Stack.Screen
          name="CheckoutForm"
          component={CheckoutForm}
          options={{ title: 'CheckoutForm' }}
        />
        <Stack.Screen
          name="WorkPackagePreview"
          component={WorkPackagePreview}
          options={{ title: 'WorkPackagePreview' }}
        />
        <Stack.Screen
          name="PackagePreview"
          component={PackagePreview}
          options={{ title: 'PackagePreview' }}
        />
        <Stack.Screen
          name="ChildTimeframes"
          component={ChildTimeframes}
          options={{ title: `List Child's Timeframes` }}
        />
        <Stack.Screen
          name="AdminViewTeacherProfile"
          component={AdminViewTeacherProfile}
          options={{ title: `AdminViewTeacherProfile` }}
        />
        <Stack.Screen
          name="SuspendedUser"
          component={SuspendedUser}
          options={{ title: `SuspendedUser` }}
        />
        <Stack.Screen
          name="ForgotCredentials"
          component={ForgotCredentials}
          options={{ title: `Forgot Credentials`, headerRight: () => null }}
        />
        <Stack.Screen
          name="ResetCredentials"
          component={ResetCredentials}
          options={{ title: `Reset Credentials`, headerRight: () => null }}
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
