import { describe, expect, test, beforeAll } from '@jest/globals';
import { render, fireEvent, act, waitfor } from '@testing-library/react-native';
import ParentHomeScreen from '../../screens/User/ParentHomeScreen';
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

// Mock fetch API for user
jest.mock('../../components/AsyncStorage', () => ({
  getUser: jest.fn(() =>
    Promise.resolve(
      JSON.stringify({ user: { id: 'user123', name: 'John Doe', parentalAccessPIN: '1234' } })
    )
  ),
}));

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

// Mock fetch API for work packages
global.fetch = jest.fn((url) => {
  if (url === 'https://lockandlearn.onrender.com/child/getchildren/user123') {
    return Promise.resolve({
      json: () => Promise.resolve([{ _id: 'child1', firstName: 'Child One' }]),
      status: 200,
    });
  } else {
    return Promise.resolve({
      json: () => Promise.resolve(),
      status: 200,
    });
  }
});

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
    // Rendering the component with the button
    const { getByText } = render(<ParentHomeScreen />);

    // Simulating a button click
    fireEvent.press(getByText('Parent Access'));
  });

  test('Toggle parent access when button is clicked and go back', () => {
    // Rendering the component with the button
    const { getByText } = render(<ParentHomeScreen />);

    // Simulating a button click
    fireEvent.press(getByText('Parent Access'));
    fireEvent.press(getByText('Go Back'));
  });

  test('Attempt to create a new pin with bad inputs', () => {
    const { getByText, getByTestId } = render(<ParentHomeScreen />);
    fireEvent.press(getByText('Parent Access'));

    // Input incorrect PINs and submit
    const createPIN = getByTestId('create-pin-input');
    const confirmPIN = getByTestId('confirm-pin-input');
    const submitButton = getByText('Confirm');

    fireEvent.changeText(createPIN, '1234');
    fireEvent.changeText(confirmPIN, '12345');
    fireEvent.press(submitButton);
  });

  test('Attempt to create a new PIN', () => {
    // Rendering the component with the button
    const { getByText, getByTestId } = render(<ParentHomeScreen />);

    // Simulating a button click
    fireEvent.press(getByText('Parent Access'));

    // Input PINs and submit
    const createPIN = getByTestId('create-pin-input');
    const confirmPIN = getByTestId('confirm-pin-input');
    const submitButton = getByText('Confirm');

    fireEvent.changeText(createPIN, '1234');
    fireEvent.changeText(confirmPIN, '1234');
    fireEvent.press(submitButton);
  });
});
