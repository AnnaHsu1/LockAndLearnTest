import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import TutorImageUploadScreen from '../../screens/User/TutorImageUploadScreen';
import * as DocumentPicker from 'expo-document-picker';
import { toast } from 'react-toastify';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

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

jest.mock('react-native-paper', () => {
  const React = require('react');
  return {
    ...jest.requireActual('react-native-paper'),
    Icon: () => React.createElement('Icon'),
  };
});

jest.mock('expo-document-picker', () => ({
  getDocumentAsync: jest.fn(),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);

jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'web',
  select: jest.fn().mockImplementation((spec) => (spec.web ? spec.web : spec.default)),
}));

jest.mock('react-toastify', () => {
  const originalModule = jest.requireActual('react-toastify');
  return {
    ...originalModule,
    toast: {
      success: jest.fn(),
    },
  };
});

describe('tests for image verification upload', () => {
  // Mock return value of Document Picker
  beforeEach(() => {
    DocumentPicker.getDocumentAsync.mockReset();
    DocumentPicker.getDocumentAsync.mockResolvedValue({
      type: 'success',
      output: [{ name: 'picture1.jpeg' }, { name: 'picture2.png' }],
    });
  });

  it('render elements correctly', () => {
    const { getByText } = render(<TutorImageUploadScreen />);
    expect(getByText(' Please upload two pictures of yourself for authentication purposes')).toBeTruthy();
    expect(getByText('Your pictures must conform to the following criteria:')).toBeTruthy();
    expect(getByText('1- Take a clear picture of your face ')).toBeTruthy();
    expect(getByText("Supported formats: JPEG, JPG, PNG")).toBeTruthy();
    expect(getByText('Upload')).toBeTruthy();
  });

  it('upload button is disabled when there are no uploaded pictures', () => {
    const { getByTestId } = render(<TutorImageUploadScreen />);
    const submitButton = getByTestId('uploadButton');
    // upload button should be disabled if there are no uploaded pictures
    expect(submitButton.props.accessibilityState).toHaveProperty('disabled', true);
  });

  it('handles picture selection', async () => {
    DocumentPicker.getDocumentAsync.mockResolvedValue({
      type: 'success',
      output: [{ name: 'picture1.jpeg' }],
    });

    const { getByTestId } = render(<TutorImageUploadScreen />);
    fireEvent.press(getByTestId('selectButton'));
    // file explorer should be opened when clicking on select button
    await waitFor(() => {
      expect(DocumentPicker.getDocumentAsync).toHaveBeenCalled();
    });
  });

  it('handles picture deletion', async () => {
    DocumentPicker.getDocumentAsync.mockResolvedValue({
      type: 'success',
      output: [{ name: 'picture1.jpeg' }, { name: 'picture2.png' }],
    });

    const { getByTestId, findByTestId, queryByText } = render(<TutorImageUploadScreen />);
    fireEvent.press(getByTestId('selectButton'));
    await findByTestId('deleteButton-0');
    fireEvent.press(getByTestId('deleteButton-0'));

    const picture = queryByText('picture1.jpeg');
    expect(picture).toBeNull();
  });

  it('should not display a Toastify success notification', () => {   
    const { getByTestId } = render(<TutorImageUploadScreen />);
    fireEvent.press(getByTestId('uploadButton'));
    // If user does not upload 2 pictures, no Toast success notification should appear
    expect(toast.success).not.toHaveBeenCalled()
  });
})