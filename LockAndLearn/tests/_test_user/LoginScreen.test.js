import { describe, expect, test, beforeAll } from '@jest/globals';
import { render, fireEvent, act } from '@testing-library/react-native';
import LoginScreen from '../../screens/User/LoginScreen';
const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();

const mockLoginUser = {
  Email: 'email@test.com',
  Password: 'test123@',
};

// Mock fetch function
const signupHandler = async (loginData) => {
  await fetch('http://localhost:4000/users/login', {
    method: 'POST',
    body: JSON.stringify(loginData),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

describe('testing connection to server', () => {
  test('make POST request and test connection to server', async () => {
    // Mock response
    fetchMock.mockResponseOnce(JSON.stringify({ message: 'User successfully logged in' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

    // Check fetch is called with its expected URL, method and body
    await signupHandler(mockLoginUser);
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:4000/users/login', {
      method: 'POST',
      body: JSON.stringify(mockLoginUser),
      headers: { 'Content-Type': 'application/json' },
    });

    // Check response message afect sending to server
    const response = await fetch('http://localhost:4000/users/login', {
      method: 'POST',
      body: JSON.stringify(mockLoginUser),
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.status) {
      expect(response.status).toBe(200);
      if (response.headers.get('content-type')?.includes('application/json')) {
        const data = await response.json();
        expect(data.message).toBe('User successfully logged in');
      }
    }
  });
});

// describe('Components rendering correctly', () => {
//   test('does login screen render', () => {
//     const { getByTestId } = render(<LoginScreen />);
//   });

//   test('input email and password for login', () => {
//     const { getByTestId } = render(<LoginScreen />);

//     const email = getByTestId('email-input');
//     fireEvent.changeText(email, mockLoginUser.Email);
//     expect(email.props.value).toBe(mockLoginUser.Email);

//     const firstName = getByTestId('password-input');
//     fireEvent.changeText(firstName, mockLoginUser.Password);
//     expect(firstName.props.value).toBe(mockLoginUser.Password);
//   });

//   test('does login button exist', () => {
//     const { getByTestId } = render(<LoginScreen />);
//     const loginButton = getByTestId('login-button');
//     expect(loginButton).toBeDefined();
//   });
// });
