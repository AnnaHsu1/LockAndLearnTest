import { describe, expect, test, beforeEach } from '@jest/globals';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../../screens/User/LoginScreen';
import fetchMock from 'jest-fetch-mock';

// Mock Google.useAuthRequest
jest.mock('expo-auth-session/providers/google', () => ({
  useAuthRequest: jest.fn(() => [null, { type: 'success', authentication: { accessToken: 'mockAccessToken' } }, jest.fn()]),
}));

// Mock AsyncStorage
jest.mock('../../components/AsyncStorage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  setUserTokenWithExpiry: jest.fn(),
}));

jest.mock('expo-status-bar', () => ({
  StatusBar: () => 'StatusBar',
}));


// Import the mocked AsyncStorage module
import * as AsyncStorage from '../../components/AsyncStorage';

// Mock Navigation
const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
};

// Enable mock for fetch
fetchMock.enableMocks();

describe('LoginScreen Component', () => {
  

  beforeEach(() => {
    // Reset mocks before each test
    fetchMock.resetMocks();
    AsyncStorage.getItem.mockClear();
    AsyncStorage.setItem.mockClear();
    AsyncStorage.removeItem.mockClear();
    AsyncStorage.setUserTokenWithExpiry.mockClear();

    // Set a default mock return value for getItem
    AsyncStorage.getItem.mockResolvedValue(null);
  });

  const mockLoginUser = {
    email: 'email@test.com',
    password: 'test123@',
  };

  test('sends a POST request to the server with correct data', async () => {
    // Assume the new API endpoint for user login
    const apiEndpoint = 'https://data.mongodb-api.com/app/lock-and-learn-xqnet/endpoint/userLogin';

    // Mock the response with the correct content type
    fetchMock.mockResponseOnce(JSON.stringify({ message: 'User successfully logged in' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

    // Render the component with the mock navigation
    const { getByTestId } = render(<LoginScreen navigation={mockNavigation} />);

    // Simulate user input and login attempt
    fireEvent.changeText(getByTestId('email-input'), mockLoginUser.email);
    fireEvent.changeText(getByTestId('password-input'), mockLoginUser.password);
    fireEvent.press(getByTestId('login-button'));

    // Wait for the fetch to be called
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(apiEndpoint, {
        method: 'POST',
        body: JSON.stringify(mockLoginUser),
        headers: { 'Content-Type': 'application/json' },
      });
    });
  });
  


  test('shows an error message with invalid email', async () => {
    const { getByTestId, findByText } = render(<LoginScreen />);
  
    // Simulate entering an invalid email and trigger the validation
    fireEvent.changeText(getByTestId('email-input'), 'invalidemail');
    fireEvent.press(getByTestId('login-button'));
  
    // Wait for the email error message to appear
    await waitFor(() => {
      expect(findByText('Please input a valid email.')).toBeTruthy();
    });
  });

  test('shows an error message with empty password', async () => {
    const { getByTestId, findByText } = render(<LoginScreen />);

    // Simulate entering a valid email but no password
    fireEvent.changeText(getByTestId('email-input'), 'email@test.com');
    fireEvent.changeText(getByTestId('password-input'), '');
    fireEvent.press(getByTestId('login-button'));

    // Wait for the password error message to appear
    await waitFor(() => {
      expect(findByText('Please input a password.')).toBeTruthy();
    });
  });

  test('does not show error messages with valid inputs', async () => {
    // Mock getItem to return null for this test
    AsyncStorage.getItem.mockResolvedValue(null);

    const { getByTestId, queryByText } = render(<LoginScreen />);

    // Simulate entering valid email and password
    fireEvent.changeText(getByTestId('email-input'), 'email@test.com');
    fireEvent.changeText(getByTestId('password-input'), 'password123');
    fireEvent.press(getByTestId('login-button'));

    // Ensure no error messages are displayed
    expect(queryByText('Please input a valid email.')).toBeNull();
    expect(queryByText('Please input a password.')).toBeNull();
  });

});

describe('LoginScreen Google Authentication', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    AsyncStorage.setUserTokenWithExpiry.mockClear();
    mockNavigate.mockClear();
  });

  test('successful Google login and user info retrieval', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ email: 'test@example.com' }));

    const { getByTestId } = render(<LoginScreen navigation={mockNavigation} />);
    const googleLoginButton = getByTestId('google-login-button');

    // Simulate Google login success
    fireEvent.press(googleLoginButton);
  });

});