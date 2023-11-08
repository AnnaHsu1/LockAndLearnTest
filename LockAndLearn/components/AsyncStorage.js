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

export const setUserTokenWithExpiry = async (key, data) => {
  const now = new Date();
  // Set expiry time to 30 minutes
  now.setMinutes(now.getMinutes() + 1);
  const expiryTimeInTimestamp = Math.floor(now.getTime() / 1000);
  const user = { ...data, tokenExpiration: expiryTimeInTimestamp };
  await setItem(key, JSON.stringify(user));
};
