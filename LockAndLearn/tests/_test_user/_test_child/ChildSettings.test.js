import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ChildSettings from '../../../screens/User/Child/ChildSettings';
import { Button, Icon } from 'react-native-paper';

// Mock any necessary modules
jest.mock('react-native-paper', () => ({
  Button: 'Button',
  Icon: 'Icon',
}));

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
};

// Mock route
const mockRoute = {
  params: {
    child: {
      firstName: 'John',
      lastName: 'Doe',
    },
  },
};

describe('ChildSettings Screen', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <ChildSettings route={mockRoute} navigation={mockNavigation} />
    );

    expect(getByText('John Doe')).toBeTruthy();
  });

  it('navigates to ChildPassingGradePerSubject on button press', () => {
    const { getByTestId } = render(
      <ChildSettings route={mockRoute} navigation={mockNavigation} />
    );

    const passingGradeButton = getByTestId('passing-grade');
    fireEvent.press(passingGradeButton);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('ChildPassingGradePerSubject', { child: expect.any(Object) });
  });

});
