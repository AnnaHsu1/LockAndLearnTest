// Mock the useNavigation hook
global.fetch = require('jest-fetch-mock');
// Mock the @react-navigation/native module
jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
  };
});

jest.mock('../../components/AsyncStorage', () => ({
  getItem: jest.fn(() => Promise.resolve(JSON.stringify({ _id: 'user123' }))),
}));

import CreateWorkPackage from '../../screens/WorkPackage/CreateWorkPackage';
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';


describe('CreateWorkPackage', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<CreateWorkPackage />);
    const createButton = getByTestId('createWorkPackageButton');
    expect(createButton).toBeTruthy();
  });

  it('enables create button when a subject and a grade are selected', () => {
    const { getByTestId } = render(<CreateWorkPackage />);

    const subjectPicker = getByTestId('subject-picker');
    const gradePicker = getByTestId('grade-picker');
    const descriptionInput = getByTestId('description-input');
    const priceInput = getByTestId('price-input');

    // Simulate selecting values on the pickers
    fireEvent(subjectPicker, 'onValueChange', 'Math');
    fireEvent(gradePicker, 'onValueChange', '1st Grade');
    fireEvent.changeText(descriptionInput, 'This is a description');
    fireEvent.changeText(priceInput, '10');

    // Get the create button using its testID
    const createButton = getByTestId('createWorkPackageButton');
    expect(createButton.props.accessibilityState.disabled).toBeFalsy();
  });

  it('creates a work package and navigates on successful response', async () => {
    // Mock the fetch response
    fetch.mockResponseOnce(JSON.stringify({ _id: 'wp123' }), { status: 200 });

    const { getByTestId } = render(<CreateWorkPackage />);

    // Set up your component state as needed for the test
    // For example, selecting a subject and grade
    const subjectPicker = getByTestId('subject-picker');
    const gradePicker = getByTestId('grade-picker');
    const descriptionInput = getByTestId('description-input');
    const priceInput = getByTestId('price-input');

    // Simulate selecting values on the pickers
    fireEvent(subjectPicker, 'onValueChange', 'Math');
    fireEvent(gradePicker, 'onValueChange', '1st Grade');
    fireEvent.changeText(descriptionInput, 'This is a description');
    fireEvent.changeText(priceInput, '10');

    // Simulate the creation of the work package
    fireEvent.press(getByTestId('createWorkPackageButton'));
  });

  it('logs an error for network issues', async () => {
    // Mock a network error
    fetch.mockReject(new Error('Network error'));

    // Create a spy on console.error
    const consoleSpy = jest.spyOn(console, 'error');

    const { getByTestId } = render(<CreateWorkPackage />);

    fireEvent.press(getByTestId('createWorkPackageButton'));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Network error while fetching subjects:',
        expect.any(Error) // This matches any Error object
      );
    });

    // Correctly restore the original console.error function
    consoleSpy.mockRestore();
  });

  it('logs an error when server response is not 200 or 201', async () => {
    // Mock a server response that's not 200 or 201
    fetch.mockResponseOnce('', { status: 500 });

    // Spy on console.error
    const consoleSpy = jest.spyOn(console, 'error');

    const { getByTestId } = render(<CreateWorkPackage />);

    // Simulate the creation of the work package
    fireEvent.press(getByTestId('createWorkPackageButton'));

    await waitFor(() => {
      // Expect console.error to have been called with the actual error message
      expect(consoleSpy).toHaveBeenCalledWith(
        'Network error while fetching subjects:',
        expect.anything() // This matches any additional arguments passed to the function
      );
    });

    // Restore the original console.error function
    consoleSpy.mockRestore();
  });



});
