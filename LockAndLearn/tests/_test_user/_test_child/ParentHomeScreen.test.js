import { describe, expect, test, beforeAll } from '@jest/globals';
import { render, fireEvent, act, waitfor } from '@testing-library/react-native';
import ParentHomeScreen from '../../../screens/User/ParentHomeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();
global.clearImmediate = (id) => {
  clearTimeout(id);
};
global.setImmediate = (callback, ...args) => {
  const immediateId = setTimeout(callback, 0, ...args);
  return immediateId;
};

// Mock the useRoute hook
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: () => ({
    // Mock the route object properties here
    params: {
      // Define any expected route params
    },
  }),
}));

describe('ParentHomeScreen component', () => {
  test('renders correctly', () => {
    const { getByText, getByTestId } = render(
      <ParentHomeScreen navigation={{ navigate: jest.fn() }} />
    );
    const welcomeText = getByText('Welcome back');
    const selectChild = getByText('Select a Child');
    const parentAccess = getByText('Parent Access');
    expect(welcomeText).toBeTruthy();
    expect(parentAccess).toBeTruthy();
    
    // const parentalAccess = getByText('Parental Access');
    // const parentalAccessDescription = getByText('It seems like this is your first time requesting parental access.');
    // const createPIN = getByText('Please create a PIN');
    // const confirmPIN = getByText('Confirm PIN');

    // expect(parentalAccess).toBeTruthy();
    // expect(parentalAccessDescription).toBeTruthy();
    // expect(createPIN).toBeTruthy();
    // expect(confirmPIN).toBeTruthy();
  });

  test('Toggle parent access when button is clicked', () => {
    // Mocking the necessary dependencies and setting initial state
    const setParentalAccess = jest.fn();
    const parentalAccess = false;
  
    // Rendering the component with the button
    const { getByText } = render(<ParentHomeScreen />);
  
    // Simulating a button click
    fireEvent.press(getByText('Parent Access'));
  
    // Verifying that the setParentalAccess function is called with the correct value
    // expect(setParentalAccess).toHaveBeenCalledWith(true);
  });


});
