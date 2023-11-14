// Mocking @expo/vector-icons
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return {
    Ionicons: () => React.createElement('Ionicons'),
    MaterialIcons: () => React.createElement('MaterialIcons'),
    // Mock other icon sets if used
  };
});

// Mocking react-native-paper
jest.mock('react-native-paper', () => {
  const React = require('react');
  return {
    ...jest.requireActual('react-native-paper'),
    Icon: () => React.createElement('Icon'),
  };
});

import UploadScreen from '../../screens/StudyMaterial/UploadScreen';
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Mocking the external modules
jest.mock('expo-document-picker', () => ({
  getDocumentAsync: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
}));

// Mocking fetch for network requests
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

describe('<UploadScreen />', () => {
  // Reset and setup the mock before each test
  beforeEach(() => {
    // Reset the mock
    DocumentPicker.getDocumentAsync.mockReset();

    // Setup the mock return value
    DocumentPicker.getDocumentAsync.mockResolvedValue({
      type: 'success',
      output: [{ name: 'file1.pdf' }, { name: 'file2.pdf' }], // Provide an array of mock files
    });
  });

  // Test if component renders successfully
  it('renders correctly', () => {
    const { getByText } = render(<UploadScreen />);
    expect(getByText('Select files')).toBeTruthy();
  });

  // Test if file selection works
  it('handles file selection', async () => {
    // Correctly setting up the mock for DocumentPicker.getDocumentAsync
    DocumentPicker.getDocumentAsync.mockResolvedValue({
      type: 'success',
      output: [{ name: 'test.pdf' }], // Mock file objects for 'output'
    });

    const { getByTestId } = render(<UploadScreen />);
    fireEvent.press(getByTestId('selectButton'));

    await waitFor(() => {
      expect(DocumentPicker.getDocumentAsync).toHaveBeenCalled();
    });
  });

  // Test deletion of a file
  it('handles file deletion', async () => {
    // Mock file selection
    DocumentPicker.getDocumentAsync.mockResolvedValue({
      type: 'success',
      output: [{ name: 'file1.pdf' }, { name: 'file2.pdf' }],
    });

    const { getByTestId, findByTestId } = render(<UploadScreen />);

    // Trigger file selection
    fireEvent.press(getByTestId('selectButton'));

    // Wait for the file list to be updated
    await findByTestId('deleteButton-0');

    // Now attempt to delete the first file
    fireEvent.press(getByTestId('deleteButton-0'));
  });

  // Test uploading files
  it('handles file upload', async () => {
    const { getByTestId } = render(<UploadScreen />);
    fireEvent.press(getByTestId('selectButton'));

    await waitFor(() => {
      expect(DocumentPicker.getDocumentAsync).toHaveBeenCalled();
      fireEvent.press(getByTestId('uploadButton'));
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:4000/files/uploadFiles',
        expect.any(Object)
      );
    });
  });

  it('handles file selection on the web platform', async () => {
    // Set up the mock return value for DocumentPicker
    DocumentPicker.getDocumentAsync.mockResolvedValue({
      type: 'success',
      output: [{ name: 'test1.pdf' }, { name: 'test2.pdf' }],
    });

    const { getByTestId, findByText } = render(<UploadScreen />);
    fireEvent.press(getByTestId('selectButton'));

    await waitFor(() => {
      expect(DocumentPicker.getDocumentAsync).toHaveBeenCalled();
    });
  });
});

// Tests for Android platform
describe('on Android', () => {
  beforeEach(() => {
    // Override Platform.OS to 'android' for this test block
    Platform.OS = 'android';

    DocumentPicker.getDocumentAsync.mockReset();
    DocumentPicker.getDocumentAsync.mockResolvedValue({
      type: 'success',
      assets: [{ name: 'androidFile1.pdf' }, { name: 'androidFile2.pdf' }], // Mock files for Android
    });
  });

  it('handles file selection on Android', async () => {
    const { getByTestId } = render(<UploadScreen />);
    fireEvent.press(getByTestId('selectButton'));

    await waitFor(() => {
      expect(DocumentPicker.getDocumentAsync).toHaveBeenCalled();
    });
  });
});
