import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import EditWorkPackage from '../../../screens/WorkPackage/EditWorkPackage';
import { NavigationContainer } from '@react-navigation/native'; // Import NavigationContainer

// Mock the NavigationContainer to provide the navigation context
jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: jest.fn(), // Mock useNavigation hook
  };
});


describe('EditWorkPackage', () => {
  it('renders correctly', () => {
    const { getByText, getByTestId } = render(
      <NavigationContainer>
        <EditWorkPackage route={{ params: { workpackage: {} } }} />
      </NavigationContainer>
    );
    
    // Test that important elements are present on the screen
    expect(getByText('Edit work package')).toBeTruthy();
    expect(getByTestId('subject-picker')).toBeTruthy();
    expect(getByTestId('grade-picker')).toBeTruthy();
    // Add more assertions for other elements as needed
  });
  it('handles work package update when the button is pressed', () => {
    const { getByTestId } = render(<EditWorkPackage route={{ params: { workpackage: {} } }} />);
    
    // Simulate user input or interaction here if needed
    // Example: fireEvent.changeText(getByTestId('subject-picker'), 'New Subject');
    
    // Trigger the "Update work package" button press
    fireEvent.press(getByTestId('createWorkPackageButton'));
    
    // Add assertions to test your component's behavior
    // Example: expect(someFunctionToBeCalled).toHaveBeenCalled();
  });

  // Add more test cases for other functionalities and edge cases as needed
});
