import AsyncStorage from '@react-native-async-storage/async-storage';

export const getItem = async (key) => {
  return await AsyncStorage.getItem(key);
};

export const setItem = async (key, value) => {
  return await AsyncStorage.setItem(key, value);
};

export const removeItem = async (key) => {
  return await AsyncStorage.removeItem(key);
};

export const clear = async () => {
  return await AsyncStorage.clear();
};

export const getUser = async () => {
  try {
    const token = await getItem('@token');
    if (token) {
      const user = JSON.parse(token);
      // console.log(user);
      return user;
    } else {
      // Handle the case where user is undefined (not found in AsyncStorage)
      console.log('User not found in AsyncStorage');
      return null;
    }
  } catch (error) {
    console.log(error);
  }
};

export const setUserTokenWithExpiry = async (key, data) => {
  // console.log(data);
  const now = new Date();
  // Set expiry time to 30 minutes
  now.setMinutes(now.getMinutes() + 30);
  const expiryTimeInTimestamp = Math.floor(now.getTime() / 1000);
  const user = { ...data, tokenExpiration: expiryTimeInTimestamp };
  await setItem(key, JSON.stringify(user));
};

export const handleLogout = async () => {
  await removeItem('@token');
  console.log('Logged out successfully');
  navigation.navigate('Home', {
    isAuthenticated: false,
  });
};
