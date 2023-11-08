import { describe, expect, test, beforeAll } from '@jest/globals';
import { render, fireEvent, act } from '@testing-library/react-native';
import ParentAccountScreen from '../screens/User/Child/ParentAccountScreen';
const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();

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

  test('navigates to AddChild screen when "+ Add Child" is pressed', () => {
    const navigateMock = jest.fn();
    const { getByText } = render(<ParentAccountScreen navigation={{ navigate: navigateMock }} />);
    const addChildButton = getByText('+ Add Child');
    fireEvent.press(addChildButton);
    expect(navigateMock).toHaveBeenCalledWith('AddChild');
  });
});
