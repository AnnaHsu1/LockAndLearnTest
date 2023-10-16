import { describe, expect, test, beforeAll } from '@jest/globals';
import { render, fireEvent, act } from '@testing-library/react-native';
import SignUpScreen from '../screens/SignupScreen';
import { mock } from 'node:test';
const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();

const mockUser = {
  FirstName: 'testFirst',
  LastName: 'testLast',
  Account: '',
  Email: 'email@test.com',
  Password: 'test123@',
  CPassword: 'test123@',
  DOB: '1999-01-01',
};

// Mock fetch function
const signupHandler = async (userData) => {
  await fetch('http://localhost:4000/users/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

describe('testing connection to server', () => {
  test('make POST request and test connection to server', async () => {
    // Mock response
    fetchMock.mockResponseOnce(JSON.stringify({ message: 'User created' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

    // Check fetch is called with its expected URL, method and body
    await signupHandler(mockUser);
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:4000/users/signup', {
      method: 'POST',
      body: JSON.stringify(mockUser),
      headers: { 'Content-Type': 'application/json' },
    });

    // Check response message afect sending to server
    const response = await fetch('http://localhost:4000/users/signup', {
      method: 'POST',
      body: JSON.stringify(mockUser),
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.status) {
      expect(response.status).toBe(200);
      if (response.headers.get('content-type')?.includes('application/json')) {
        const data = await response.json();
        expect(data.message).toBe('User created');
      }
    }
  });
});

describe('Components rendering correctly', () => {
  test('does sign up screen render', () => {
    const { getByTestId } = render(<SignUpScreen />);
  });

  test('complete sign up form', () => {
    const { getByTestId } = render(<SignUpScreen />);

    // Adding user data to the form
    const email = getByTestId('email-input');
    fireEvent.changeText(email, mockUser.Email);
    expect(email.props.value).toBe(mockUser.Email);

    const firstName = getByTestId('first-name-input');
    fireEvent.changeText(firstName, mockUser.FirstName);
    expect(firstName.props.value).toBe(mockUser.FirstName);

    const lastName = getByTestId('last-name-input');
    fireEvent.changeText(lastName, mockUser.LastName);
    expect(lastName.props.value).toBe(mockUser.LastName);

    const password = getByTestId('password-input');
    fireEvent.changeText(password, mockUser.Password);
    expect(password.props.value).toBe(mockUser.Password);

    const cpassword = getByTestId('cpassword-input');
    fireEvent.changeText(cpassword, mockUser.CPassword);
    expect(cpassword.props.value).toBe(mockUser.CPassword);

    const birthdate = getByTestId('birthdate-input');
    fireEvent.changeText(birthdate, mockUser.DOB);
    expect(birthdate.props.value).toBe(mockUser.DOB);
  });

  test('does sign up button exist', () => {
    const { getByTestId } = render(<SignUpScreen />);

    const signupButton = getByTestId('signup-button');
    expect(signupButton).toBeDefined();
  });

  test('navigate to login if user already has an account', () => {
    const mockNavigate = jest.fn();

    const { getByTestId } = render(<SignUpScreen navigation={{ navigate: mockNavigate }} />);

    const loginLink = getByTestId('login-link');
    fireEvent.press(loginLink);

    expect(mockNavigate).toHaveBeenCalledWith('Login');
  });
});
