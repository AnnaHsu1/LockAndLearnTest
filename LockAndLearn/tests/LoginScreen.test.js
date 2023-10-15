import { describe, expect, test, beforeAll } from '@jest/globals';
import { render, fireEvent, act } from '@testing-library/react-native';
import LoginScreen from '../screens/LoginScreen';
// const mongoose = require("mongoose");

describe('Components rendering correctly', () => {
  test('does login screen render', () => {
    const { getByTestId } = render(<LoginScreen />);
  });

  test('attempt to login using existing credentials', () => {
    const { getByTestId } = render(<LoginScreen />);

    const email = getByTestId('email-input');
    const firstName = getByTestId('password-input');

    const loginButton = getByTestId('login-button');
  });
});
