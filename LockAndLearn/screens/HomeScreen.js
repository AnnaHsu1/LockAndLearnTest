import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, navigation } from "react-native";

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>HOME HOME HOME HOME</Text>
      <Button title="Login" onPress={() => navigation.navigate("Login")} />
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
