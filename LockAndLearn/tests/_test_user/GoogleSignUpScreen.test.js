import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import GoogleSignUpScreen from '../../screens/User/GoogleSignUpScreen';
import * as AsyncStorage from '../../components/AsyncStorage';

// Mock modules
jest.mock('expo-auth-session/providers/google', () => ({
    useAuthRequest: jest.fn().mockReturnValue([null, { type: 'success' }, jest.fn()]),
    // Add other functions you use from this module
  }));
  
  jest.mock('expo-web-browser', () => ({
    maybeCompleteAuthSession: jest.fn(),
    // Mock other functions if used
  }));
  
  jest.mock('../../components/AsyncStorage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    setUserTokenWithExpiry: jest.fn(),
  }));

// Mock Fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ status: 201, user: { isParent: false } }),
    status: 201, // Ensure that the status is also part of the response
  })
);


// Mock Navigation
const mockNavigate = jest.fn();
const mockRoute = { params: { userInfo: { given_name: 'John', family_name: 'Doe', email: 'john@example.com', id: '123' } } };
const mockNavigation = { navigate: mockNavigate };

describe('GoogleSignUpScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('submits the form and handles server response correctly', async () => {
    const { getByTestId, getByText } = render(
      <GoogleSignUpScreen route={mockRoute} navigation={mockNavigation} />
    );

    // Simulate form inputs and button press
    fireEvent.changeText(getByTestId('birthdate-input'), '2000-01-01');
    fireEvent.press(getByTestId('signup-button'));

    await act(async () => {});

    // Check if the fetch call was made correctly
    expect(fetch).toHaveBeenCalledWith('https://lockandlearn.onrender.com/users/signup', expect.anything());

    // Check navigation based on user type (mocked response)
    expect(mockNavigate).toHaveBeenCalledWith('UserLandingPage');
  });

  // Additional tests for error handling, other functionalities...
});
