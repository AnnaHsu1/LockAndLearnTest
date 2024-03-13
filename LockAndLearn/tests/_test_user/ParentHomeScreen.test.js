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
  if (url === 'http://localhost:4000/child/getchildren/user123') {
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
    const parentAccess = getByText('Parental Access');
    expect(welcomeText).toBeTruthy();
    expect(parentAccess).toBeTruthy();
  });

  test('Toggle parent access when button is clicked', () => {
    // Rendering the component with the button
    const { getByText } = render(<ParentHomeScreen />);

    // Simulating a button click
    fireEvent.press(getByText('Parental Access'));
  });

  test('Toggle parent access when button is clicked and go back', () => {
    // Rendering the component with the button
    const { getByText } = render(<ParentHomeScreen />);

    // Simulating a button click
    fireEvent.press(getByText('Parental Access'));
    fireEvent.press(getByText('Go Back'));
  });

  test('Attempt to input pin', () => {
    const { getByText, getByTestId } = render(<ParentHomeScreen />);
    fireEvent.press(getByText('Parental Access'));

    const pinInput = getByTestId('pin-input');
    fireEvent.changeText(pinInput, '1234');

    const confirm = getByTestId('confirm-button');
    fireEvent.press(confirm);

  });
});
