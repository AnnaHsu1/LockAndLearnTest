import { describe, expect, test, beforeEach } from '@jest/globals';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ResetCredentials from '../../screens/User/ResetCredentials';
import fetchMock from 'jest-fetch-mock';

jest.mock('expo-status-bar', () => ({
  StatusBar: () => 'StatusBar',
}));

const mockRoutePassword = {
  params: {
    email: 'test@test.com',
    cred: 'password',
  },
};

const mockRoutePIN = {
  params: {
    email: 'test@test.com',
    cred: 'PIN',
  },
};

// Enable mock for fetch
fetchMock.enableMocks();

describe('Reset Password Component', () => {
  test('Render reset password screen', async () => {
    const { getByTestId, findByText } = render(<ResetCredentials route={mockRoutePassword} />);
  });

  test('Input new password w/ correct confirmation', async () => {
    const { getByTestId } = render(<ResetCredentials route={mockRoutePassword} />);

    const passwordInput = getByTestId('password');
    fireEvent.changeText(passwordInput, 'test123@');

    const confirmPasswordInput = getByTestId('confirmPassword');
    fireEvent.changeText(confirmPasswordInput, 'test123@');

    const resetButton = getByTestId('submit-reset-password');
    fireEvent.press(resetButton);
  });

  test('Input new password w/ incorrect confirmation', async () => {
    const { getByTestId } = render(<ResetCredentials route={mockRoutePassword} />);

    const passwordInput = getByTestId('password');
    fireEvent.changeText(passwordInput, 'test123@');

    const confirmPasswordInput = getByTestId('confirmPassword');
    fireEvent.changeText(confirmPasswordInput, 'wrongpass');

    const resetButton = getByTestId('submit-reset-password');
    fireEvent.press(resetButton);
  });
});

describe('Reset PIN Component', () => {
  test('Render reset PIN screen', async () => {
    const { getByTestId, findByText } = render(<ResetCredentials route={mockRoutePIN} />);
  });

  test('Input new password w/ correct confirmation', async () => {
    const { getByTestId } = render(<ResetCredentials route={mockRoutePIN} />);

    const passwordInput = getByTestId('password');
    fireEvent.changeText(passwordInput, '0000');

    const confirmPasswordInput = getByTestId('confirmPassword');
    fireEvent.changeText(confirmPasswordInput, '0000');

    const resetButton = getByTestId('submit-reset-password');
    fireEvent.press(resetButton);
  });
});
