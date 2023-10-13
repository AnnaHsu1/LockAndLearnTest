import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, navigation } from "react-native";

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Button title="Log in" onPress={() => navigation.navigate("Login")} />
      <Button title="Sign up" onPress={() => navigation.navigate("Signup")} />
      <Button title="Upload" onPress={() => navigation.navigate("Upload")} />
      <Button title="Uploading" onPress={() => navigation.navigate("Uploading")} />
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default HomeScreen;
