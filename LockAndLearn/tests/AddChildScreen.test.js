import { describe, expect, test, beforeAll } from '@jest/globals';
import { render, fireEvent, act } from '@testing-library/react-native';
import AddChildScreen from '../screens/User/Child/AddChildScreen';
const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();

describe('AddChildScreen component', () => {
  test('renders correctly', () => {
    const { getByTestId } = render(<AddChildScreen />);

    // You can write assertions here to verify the rendered UI components.
    // For example:
    expect(getByTestId('first-name-input')).toBeTruthy();
    expect(getByTestId('last-name-input')).toBeTruthy();
    expect(getByTestId('grade-input')).toBeTruthy();
    expect(getByTestId('signup-button')).toBeTruthy();
  });
});
