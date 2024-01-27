import { describe, expect, test, beforeAll } from '@jest/globals';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import ChildTimeframes from '../../../screens/User/Child/ChildTimeframes';
import { useRoute } from '@react-navigation/native';

// Mock the useRoute hook
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: () => ({
    // Mock the route object properties here
    params: {
      // Define any expected route params
      child: {
        _id: 'child1',
        firstName: 'Child One',
      },
    },
  }),
}));

jest.mock('../../../components/AsyncStorage', () => ({
  getUser: jest.fn(() => Promise.resolve(JSON.stringify({ _id: 'user123' }))),
}));

// Mock fetch API
global.fetch = jest.fn((url) => {
  if (url === 'http://localhost:4000/timeframes/addtimeframe') {
    return Promise.resolve({
      json: () => Promise.resolve(),
      status: 200,
    });
  } else {
    return Promise.resolve({
      json: () => Promise.resolve({}),
      status: 200,
    });
  }
});

describe('Child timeframe tests', () => {
  test('renders correctly', async () => {
    const { getByTestId, getByText } = render(<ChildTimeframes route={useRoute()} />);
    const addTimeFrame = getByTestId('add-timeframe');
    const editTimeFrame = getByTestId('edit-timeframe');
    const title = getByText('Timeframes');

    expect(addTimeFrame).toBeTruthy();
    expect(editTimeFrame).toBeTruthy();
    expect(title).toBeTruthy();
  });
});
