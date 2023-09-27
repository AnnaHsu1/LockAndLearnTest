import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import UploadScreen from "../screens/UploadScreen";
import EditUploadScreen from "../screens/EditUploadScreen";
import SignupScreen from "../screens/SignupScreen";

const Stack = createNativeStackNavigator();

const StackNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Welcome" }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Login" }} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{ title: "Sign up" }} />
        <Stack.Screen name="Upload" component={UploadScreen} options={{ title: "Upload Study Material" }} />
        <Stack.Screen name="Uploading" component={EditUploadScreen} options={{ title: "Uploading files" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigation;
