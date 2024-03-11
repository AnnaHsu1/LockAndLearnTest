import { describe, expect, test, beforeEach } from '@jest/globals';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ForgotCredentials from '../../screens/User/ForgotCredentials';
import fetchMock from 'jest-fetch-mock';

jest.mock('expo-status-bar', () => ({
  StatusBar: () => 'StatusBar',
}));

// Enable mock for fetch
fetchMock.enableMocks();

describe('Forgot Credential Component', () => {
  test('Render forgot credential screen', async () => {
    const { getByTestId, findByText } = render(<ForgotCredentials />);
  });

  test('Input new password w/ correct confirmation', async () => {
    const { getByTestId } = render(<ForgotCredentials />);

    const email = getByTestId('email');
    fireEvent.changeText(email, 'test@test.ca');

    const submit = getByTestId('submit');
    fireEvent.press(submit);
  });
});
