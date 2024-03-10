import { describe, expect, test, beforeEach } from '@jest/globals';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ResetPassword from '../../screens/User/ResetPassword';
import fetchMock from 'jest-fetch-mock';

jest.mock('expo-status-bar', () => ({
  StatusBar: () => 'StatusBar',
}));

const mockRoute = {
  params: {
    email: 'test@test.com',
  },
};

// Enable mock for fetch
fetchMock.enableMocks();

describe('LoginScreen Component', () => {
  test('Render reset password screen', async () => {
    const { getByTestId, findByText } = render(<ResetPassword route={mockRoute} />);
  });

  test('Input new password w/ correct confirmation', async () => {
    const { getByTestId } = render(<ResetPassword route={mockRoute} />);

    const passwordInput = getByTestId('password');
    fireEvent.changeText(passwordInput, 'test123@');

    const confirmPasswordInput = getByTestId('confirmPassword');
    fireEvent.changeText(confirmPasswordInput, 'test123@');

    const resetButton = getByTestId('submit-reset-password');
    fireEvent.press(resetButton);
  });
});
