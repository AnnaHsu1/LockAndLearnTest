jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('expo-linking');

jest.mock('expo-auth-session/providers/google', () => ({
  useAuthRequest: jest.fn(() => ({
    request: jest.fn(),
    response: jest.fn(),
    promptAsync: jest.fn(),
  })),
}));
jest.mock('react-native/Libraries/Settings/Settings', () => ({
  get: jest.fn(),
  set: jest.fn(),
}));

jest.mock('react-native', () => {
  const RealReactNative = jest.requireActual('react-native');
  return {
    ...RealReactNative,
    CheckBox: () => 'MockedCheckBox', // Mock implementation
  };
});
