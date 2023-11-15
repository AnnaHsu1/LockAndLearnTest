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

  // Add more tests as needed...
});
