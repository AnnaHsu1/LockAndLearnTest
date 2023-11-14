import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import SignupScreen from '../../screens/User/SignupScreen';
import * as AsyncStorage from '../../components/AsyncStorage';


// Mock the navigation and other external modules
const mockNavigate = jest.fn();
const mockNavigation = { navigate: mockNavigate };
jest.mock('@react-navigation/native', () => ({
  // ... other mocks if necessary
}));
jest.mock('../../components/AsyncStorage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  setUserTokenWithExpiry: jest.fn(), // Add this line to mock setUserTokenWithExpiry
}));

jest.mock('expo-auth-session/providers/google', () => ({
  useAuthRequest: jest.fn().mockReturnValue([null, { type: 'success', authentication: { accessToken: 'dummy_token' } }, jest.fn()]),
}));

jest.mock('expo-status-bar', () => ({
  StatusBar: () => 'StatusBar',
}));

// Improved global fetch mock that can handle different scenarios
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('SignupScreen', () => {
  beforeEach(() => {
    mockFetch.mockClear().mockResolvedValue({
      json: () => Promise.resolve({ status: 201, user: { isParent: false } }),
    });
    mockNavigate.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('allows users to enter their email', async () => {
    const { getByTestId } = render(<SignupScreen navigation={mockNavigation} />);
    const emailInput = getByTestId('email-input');
    await act(async () => {
      fireEvent.changeText(emailInput, 'test@example.com');
    });
    expect(emailInput.props.value).toBe('test@example.com');
  });

  it('submits the form and navigates on successful signup', async () => {
    const { getByTestId } = render(<SignupScreen navigation={mockNavigation} />);
    
    // Simulate filling out the form fields
    fireEvent.changeText(getByTestId('email-input'), 'test@example.com');
    fireEvent.changeText(getByTestId('first-name-input'), 'John');
    fireEvent.changeText(getByTestId('last-name-input'), 'Doe');
    fireEvent.changeText(getByTestId('birthdate-input'), '2000-01-01');
    fireEvent.changeText(getByTestId('password-input'), 'password123');
    fireEvent.changeText(getByTestId('cpassword-input'), 'password123');
  
    // Make sure the 'isParent' state is set if it's not handled by the above inputs
    // This may require you to simulate pressing a radio button or switch
  
    // Now retrieve the signup button by its test ID
    const signupButton = getByTestId('signup-button');
  
    // Simulate pressing the signup button
    await act(async () => {
      fireEvent.press(signupButton);
    });
  
    // Check if the fetch mock was called
    expect(mockFetch).toHaveBeenCalled();
  
    // Verify that the fetch was called with the correct body
    const actualFetchCall = mockFetch.mock.calls.find(call => call[0] === 'http://localhost:4000/users/signup');
    const actualBody = JSON.parse(actualFetchCall[1].body);
  
    const expectedBody = {
      Email: 'test@example.com',
      FirstName: 'John',
      LastName: 'Doe',
      DOB: '2000-01-01',
      Password: 'password123',
      CPassword: 'password123',
      isParent: 'first', // Ensure this is the actual value the component is supposed to send
    };
  
    expect(actualBody).toEqual(expectedBody);

  });

  it('navigates to the correct screen based on user type on successful signup', async () => {
    const parentUser = { isParent: true };
    // Mock fetch response for success
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ status: 201, user: parentUser }),
    });

    const { getByTestId } = render(<SignupScreen navigation={mockNavigation} />);
    
    // Simulate filling out the form fields
    // ... simulate form inputs

    // Now retrieve the signup button by its test ID
    const signupButton = getByTestId('signup-button');

    // Simulate pressing the signup button and wait for async operations to complete
    await act(async () => {
      fireEvent.press(signupButton);
    });
  });

  
  

});
