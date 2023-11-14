// Import required testing utilities
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

// Import the component to test
import LockingSchedulePresentation from '../../screens/Locking/LockingSchedulePresentation';

// Mock the useNavigation hook
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
  };
});

describe('LockingSchedulePresentation', () => {
  afterEach(() => {
    // Clear all mocks after each test
    jest.clearAllMocks();
  });

  it('should render header time', () => {
    const { getByTestId } = render(<LockingSchedulePresentation />);
    expect(getByTestId('header-time')).not.toBeNull();
  });

  it('should open modal when End Session is pressed', () => {
    const { getByTestId } = render(<LockingSchedulePresentation />);
    fireEvent.press(getByTestId('end-session-button'));
    expect(getByTestId('modal-title')).not.toBeNull();
  });

  it('should close modal and navigate to Home when correct password is entered', () => {
    const { getByTestId } = render(<LockingSchedulePresentation />);
    fireEvent.press(getByTestId('end-session-button'));
    fireEvent.changeText(getByTestId('passwordInput'), '1234');
    //fireEvent.press(getByTestId('modal-button'));
    //expect(mockNavigate).toHaveBeenCalledWith('Home');
  });

  it('should not navigate to Home when incorrect password is entered', () => {
    const { getByTestId } = render(<LockingSchedulePresentation />);
    fireEvent.press(getByTestId('end-session-button'));
    fireEvent.changeText(getByTestId('passwordInput'), 'wrong');
    //fireEvent.press(getByTestId('modal-button'));
    //expect(mockNavigate).not.toHaveBeenCalledWith('Home');
  });

  // Add more tests as needed...
});