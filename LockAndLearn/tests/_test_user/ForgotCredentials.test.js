import { describe, expect, test, beforeEach } from '@jest/globals';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ForgotCredentials from '../../screens/User/ForgotCredentials';
import fetchMock from 'jest-fetch-mock';

jest.mock('expo-status-bar', () => ({
  StatusBar: () => 'StatusBar',
}));

// Enable mock for fetch
fetchMock.enableMocks();

const mockRoutePassword = {
  params: {
    email: 'test@test.com',
    credential: 'password',
  },
};

const mockRoutePIN = {
  params: {
    email: 'test@test.com',
    credential: 'pin',
  },
};

describe('Forgot Credential Component for Password', () => {
  test('Render forgot credential screen', async () => {
    const { getByTestId, findByText } = render(<ForgotCredentials route={mockRoutePassword} />);
  });

  test('Input new password w/ correct confirmation', async () => {
    const { getByTestId } = render(<ForgotCredentials route={mockRoutePassword} />);

    const email = getByTestId('email');
    fireEvent.changeText(email, 'test@test.ca');

    const submit = getByTestId('submit');
    fireEvent.press(submit);
  });
});

describe('Forgot Credential Component for PIN', () => {
  test('Render forgot credential screen', async () => {
    const { getByTestId, findByText } = render(<ForgotCredentials route={mockRoutePIN} />);
  });

  test('Input new PIN w/ correct confirmation', async () => {
    const { getByTestId } = render(<ForgotCredentials route={mockRoutePIN} />);

    const email = getByTestId('email');
    fireEvent.changeText(email, 'test@test.ca');

    const submit = getByTestId('submit');
    fireEvent.press(submit);
  });
});
