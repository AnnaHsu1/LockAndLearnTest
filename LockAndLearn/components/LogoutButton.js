import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { handleLogout } from './AsyncStorage';
import { FontAwesome } from '@expo/vector-icons';

const LogoutButton = () => {
  return (
    // <View style={styles.buttonContainer}>
    //   <Button title="Log out" style={styles.headerLink} onPress={handleLogout} />
    // </View>
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}
        onPress={handleLogout}
      >
        <Text style={{ color: '#fff', paddingRight: 10 }}>Logout</Text>
        <FontAwesome name="sign-out" size={24} color="#fff" onPress={handleLogout} />
      </TouchableOpacity>
    </View>
  );
};
export default LogoutButton;

const styles = StyleSheet.create({
  buttonContainer: {
    maxWidth: 200,
    maxHeight: 50,
  },
});
