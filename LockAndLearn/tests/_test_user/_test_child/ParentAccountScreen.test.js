import { describe, expect, test, beforeAll } from '@jest/globals';
import { render, fireEvent, act, waitfor } from '@testing-library/react-native';
import ParentAccountScreen from '../../../screens/User/Child/ParentAccountScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();
global.clearImmediate = (id) => {
  clearTimeout(id);
};
global.setImmediate = (callback, ...args) => {
  const immediateId = setTimeout(callback, 0, ...args);
  return immediateId;
};

// Mock the useRoute hook
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: () => ({
    // Mock the route object properties here
    params: {
      // Define any expected route params
    },
  }),
}));

describe('ParentAccountScreen component', () => {
  test('renders correctly', () => {
    const { getByText, getByTestId } = render(
      <ParentAccountScreen navigation={{ navigate: jest.fn() }} />
    );
    const welcomeText = getByText('Welcome back');
    const selectChildText = getByText('Select a child');
    expect(welcomeText).toBeTruthy();
    expect(selectChildText).toBeTruthy();
  });

  test('renders children data correctly', async () => {
    // Mock AsyncStorage to return a token
    jest.spyOn(AsyncStorage, 'getItem').mockResolvedValue(JSON.stringify({ token: 'mockToken' }));
    // Mock children data
    const mockChildren = [
      { _id: 'child1', firstName: 'Child One' },
      { _id: 'child2', firstName: 'Child Two' },
    ];

    // Mock fetch call
    fetchMock.mockResponseOnce(JSON.stringify(mockChildren));

    const { findByTestId } = render(<ParentAccountScreen navigation={{ navigate: jest.fn() }} />);

    // Wait for children buttons to render
    const firstChildButton = await findByTestId('child-child1');

    // Assertions to check if children are rendered
    expect(firstChildButton).toBeTruthy();
  });

  test('navigates to AddChild screen when "+ Add Child" is pressed', () => {
    const navigateMock = jest.fn();
    const { getByText } = render(<ParentAccountScreen navigation={{ navigate: navigateMock }} />);
    const addChildButton = getByText('+ Add Child');
    fireEvent.press(addChildButton);
    expect(navigateMock).toHaveBeenCalledWith('AddChild');
  });
});
