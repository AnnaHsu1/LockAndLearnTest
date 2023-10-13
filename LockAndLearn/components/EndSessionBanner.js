import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const EndSessionBanner = ({ onPress }) => {
  return (
    <View style={styles.bannerContainer}>
      <Text style={styles.bannerText}>END SESSION</Text>
      <Button title="End Session" onPress={onPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: "#407BFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  bannerText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});

export default EndSessionBanner;
