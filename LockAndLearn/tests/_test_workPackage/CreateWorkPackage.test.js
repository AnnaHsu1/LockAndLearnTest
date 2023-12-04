global.fetch = require('jest-fetch-mock');
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

jest.mock('../../components/AsyncStorage', () => ({
  getItem: jest.fn(() => Promise.resolve(JSON.stringify({ _id: 'user123' }))),
}));

import CreateWorkPackage from '../../screens/WorkPackage/CreateWorkPackage';
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { getItem } from '../../components/AsyncStorage';
import { Picker } from '@react-native-picker/picker';

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

    // Await for async operations to complete
    await waitFor(() => {
      // Check if navigation was called with correct arguments
      expect(mockNavigate).toHaveBeenCalledWith('WorkPackage', { refresh: 'wp123' });
    });
  });
});
