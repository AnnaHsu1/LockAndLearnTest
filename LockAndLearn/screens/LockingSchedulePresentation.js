import React from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";

const LockingSchedulePresentation = ({ classes }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Child's Class Schedule</Text>
      <FlatList
        data={classes}
        keyExtractor={(item, index) => index.toString()} // Use an appropriate unique key
        renderItem={({ item }) => (
          <View style={styles.classItem}>
            <Text style={styles.className}>{item.className}</Text>
            <Text style={styles.classTime}>{item.classTime}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  classItem: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
  },
  className: {
    fontSize: 18,
    fontWeight: "bold",
  },
  classTime: {
    color: "#555",
  },
});

export default LockingSchedulePresentation;
