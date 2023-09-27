import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import StackNavigation from "./components/StackNavigation";

const App = () => {
  return (
    <>
      <StackNavigation />
      {/* <View style={styles.container}>
        <Text>This is the beginning of Lock & Learn!</Text>
        <StatusBar style="auto" />
      </View> */}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default App;
