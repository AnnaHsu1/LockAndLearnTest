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
    expect(queryByText('Parent Account')).toBeTruthy();
    expect(queryByText('Log out')).toBeTruthy();

    // Check for buttons that are always present
    expect(queryByText('Upload')).toBeTruthy();
    expect(queryByText('View my Uploaded Files')).toBeTruthy();
    
  });

  it('navigates to different screens when buttons are pressed', () => {
    const { getByText } = render(<LandingPage navigation={mockNavigation} />);

    fireEvent.press(getByText('Upload'));
    expect(mockNavigate).toHaveBeenCalledWith('Upload');

    fireEvent.press(getByText('View my Uploaded Files'));
    expect(mockNavigate).toHaveBeenCalledWith('ViewUploads');

    fireEvent.press(getByText('Locking'));
    expect(mockNavigate).toHaveBeenCalledWith('Locking');

    fireEvent.press(getByText('Quiz Material'));
    expect(mockNavigate).toHaveBeenCalledWith('CreateQuiz');

    fireEvent.press(getByText('View my Work Packages'));
    expect(mockNavigate).toHaveBeenCalledWith('WorkPackageOverview');
  });

  it('handles logout', async () => {
    // Mock AsyncStorage to return a user object
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify({ isParent: true }));
  
    const { findByText } = render(<LandingPage navigation={mockNavigation} />);
  
    // Use findByText for elements that depend on async operations
    const logoutButton = await findByText('Log out');
  
    await act(async () => {
      fireEvent.press(logoutButton);
    });
  
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@token');
    expect(mockNavigate).toHaveBeenCalledWith('Home', { isAuthenticated: false });
  });
});
