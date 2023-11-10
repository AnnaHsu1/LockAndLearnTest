import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import StackNavigation from './components/StackNavigation';
import { AppProvider, UserProvider, createRealmContext } from '@realm/react';
import { APP_SERVICE_API_ID } from './config';

const App = () => {
  return (
    <AppProvider id={APP_SERVICE_API_ID}>
      <StackNavigation />
    </AppProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
