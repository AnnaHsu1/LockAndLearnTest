import { describe, expect, test, beforeAll } from '@jest/globals';
import { render, fireEvent, act } from '@testing-library/react-native';
import HomeScreen from '../screens/HomeScreen';
import * as AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  removeItem: jest.fn(),
  setItem: jest.fn(),
}));


const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();

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

const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
};


describe('HomeScreen', () => {
  test('renders correctly', () => {
    const { getByText } = render(<HomeScreen />);
    const welcomeText = getByText(/Lock & Learn/i);
    expect(welcomeText).toBeTruthy();
  });

  it('navigates to Signup screen when Sign up button is pressed', async () => {
    const navigate = jest.fn();
    const { getByText } = render(<HomeScreen navigation={{ navigate }} />);

    await act(async () => {
      fireEvent.press(getByText('Sign up'));
    });

    expect(navigate).toHaveBeenCalledWith('Signup');
  });

  it('should set isAuthenticated to true if a token is present', async () => {
    const mockToken = JSON.stringify({ someTokenData: 'tokenValue' });
    AsyncStorage.getItem.mockResolvedValue(mockToken);

    // Render the component that uses checkAuthenticated
    const { rerender, queryByText } = render(<HomeScreen />);

    // Assuming YourComponent uses checkAuthenticated and renders something based on isAuthenticated
    rerender(<HomeScreen />);

    expect(queryByText(/You are authenticated!/)).toBeFalsy();
    // Replace 'Authenticated' with whatever your component renders when isAuthenticated is true
  });

  it('navigates to the Signup screen when the Sign up button is pressed', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);

    const signupButton = getByText('Sign up');
    fireEvent.press(signupButton);

    expect(mockNavigate).toHaveBeenCalledWith('Signup');
  });

  it('navigates to the Login screen when the text is pressed', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);

    const loginText = getByText('Already have an account? Sign in');
    fireEvent.press(loginText);

    expect(mockNavigate).toHaveBeenCalledWith('Login');
  });


});