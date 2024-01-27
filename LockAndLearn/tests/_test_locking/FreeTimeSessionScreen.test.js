import { describe, expect, test, beforeAll } from '@jest/globals';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import FreeTimeSessionScreen from '../../screens/Locking/FreeTimeSessionScreen';

describe('Freetime session page', () => {
  test('renders correctly', () => {
    const { getByTestId, getByText } = render(<FreeTimeSessionScreen />);
    const title = getByText('FREE TIME!');
  });
});
