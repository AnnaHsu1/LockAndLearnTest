import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import LandingPage from '../../screens/User/LandingPage';
import * as AsyncStorage from '../../components/AsyncStorage';

// Mock the navigation and AsyncStorage
const mockNavigate = jest.fn();
const mockNavigation = { navigate: mockNavigate };
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockNavigation,
}));
jest.mock('../../components/AsyncStorage', () => ({
  getItem: jest.fn(),
  removeItem: jest.fn(),
  getUser: jest.fn(),
}));

jest.mock('expo-status-bar', () => ({
  StatusBar: () => 'StatusBar',
}));

describe('LandingPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const user = { isParent: true }; // example user object

  it('renders different buttons based on user state', async () => {
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify(user));
    const { queryByText } = render(<LandingPage navigation={mockNavigation} />);

    await act(async () => {});

    // Check for buttons that should be present when user is logged in
    // expect(queryByText('Parent Account')).toBeTruthy();

    // Check for buttons that are always present
    expect(queryByText('My Work Packages')).toBeTruthy();
    expect(queryByText('My quizzes')).toBeTruthy();
    expect(queryByText('My files')).toBeTruthy();
  });

  it('navigates to different screens when buttons are pressed', () => {
    const { getByText } = render(<LandingPage navigation={mockNavigation} />);

    fireEvent.press(getByText('My Work Packages'));
    expect(mockNavigate).toHaveBeenCalledWith('WorkPackageOverview');

    fireEvent.press(getByText('My quizzes'));
    expect(mockNavigate).toHaveBeenCalledWith('QuizzesOverviewScreen', {
      userId: null,
    });

    fireEvent.press(getByText('My files'));
    expect(mockNavigate).toHaveBeenCalledWith('ViewUploads', {
      newFilesAdded: undefined,
    });
  });
});
