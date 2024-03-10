import { describe, expect, test, beforeEach } from '@jest/globals';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ForgotPassword from '../../screens/User/ForgotPassword';
import fetchMock from 'jest-fetch-mock';

jest.mock('expo-status-bar', () => ({
  StatusBar: () => 'StatusBar',
}));

// Enable mock for fetch
fetchMock.enableMocks();

describe('Forgot Password Component', () => {
  test('Render forgot password screen', async () => {
    const { getByTestId, findByText } = render(<ForgotPassword />);
  });

  test('Input new password w/ correct confirmation', async () => {
    const { getByTestId } = render(<ForgotPassword />);

    const email = getByTestId('email');
    fireEvent.changeText(email, 'test@test.ca');

    const submit = getByTestId('submit');
    fireEvent.press(submit);
  });
});
