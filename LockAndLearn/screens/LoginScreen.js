import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, navigation } from "react-native";

const LoginScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>LOGIN LOGIN LOGIN LOGIN LOGIN</Text>
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

export default LoginScreen;
