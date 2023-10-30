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
