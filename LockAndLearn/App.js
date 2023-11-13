import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, B } from 'react-native';
import StackNavigation from './components/StackNavigation';
import { AppProvider, UserProvider, useApp } from '@realm/react';
import { APP_SERVICE_API_ID } from './config';
import { RealmProvider } from './realm/RealmProvider';

// const app = new Realm.App({ id: APP_SERVICE_API_ID });

function LogIn() {
  const app = useApp();
  // This example uses anonymous authentication.
  // However, you can use any authentication provider
  // to log a user in with this pattern.
  async function logInUser() {
    await app.logIn(Realm.Credentials.anonymous());
  }
  return <Button title="Log In" onPress={logInUser} />;
}

const App = () => {
  return (
    <AppProvider id={APP_SERVICE_API_ID}>
      <UserProvider fallback={LogIn}>
        <RealmProvider>
          <StackNavigation />
        </RealmProvider>
      </UserProvider>
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
