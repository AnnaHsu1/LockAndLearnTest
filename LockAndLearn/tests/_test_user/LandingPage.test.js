import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LandingPage from '../../screens/User/LandingPage';
import * as DocumentPicker from 'expo-document-picker';

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

describe('tests for certificates upload', () => {
  // Mock return value of Document Picker
  beforeEach(() => {
    DocumentPicker.getDocumentAsync.mockReset();
    DocumentPicker.getDocumentAsync.mockResolvedValue({
      type: 'success',
      output: [{ name: 'certificate1.pdf' }, { name: 'certificate2.pdf' }],
    });
  });

  it('render elements correctly', () => {
    const { getByText } = render(<LandingPage />);
    expect(
      getByText(' Please upload your professional certificates to proceed further')
    ).toBeTruthy();
    expect(getByText('Select certificates')).toBeTruthy();
    expect(
      getByText(
        'Uploading certificates that already existed in our system will be overwritten by the newest version.'
      )
    ).toBeTruthy();
    expect(getByText('Full Name')).toBeTruthy();
    expect(getByText('Highest Degree')).toBeTruthy();
  });

  it('button is disabled when a field is unfilled', () => {
    const { getByTestId } = render(<LandingPage />);
    const submitButton = getByTestId('uploadButton');
    // upload button should be disabled if there are fields left unfilled
    expect(submitButton.props.accessibilityState).toHaveProperty('disabled', true);
  });

  it('handles certificate selection', async () => {
    DocumentPicker.getDocumentAsync.mockResolvedValue({
      type: 'success',
      output: [{ name: 'certificatetest.pdf' }],
    });

    const { getByTestId } = render(<LandingPage />);
    fireEvent.press(getByTestId('selectButton'));
    // file explorer should be opened when clicking on select button
    await waitFor(() => {
      expect(DocumentPicker.getDocumentAsync).toHaveBeenCalled();
    });
  });

  it('handles certificate deletion', async () => {
    DocumentPicker.getDocumentAsync.mockResolvedValue({
      type: 'success',
      output: [{ name: 'certificate1.pdf' }, { name: 'certificate2.pdf' }],
    });

    const { getByTestId, findByTestId, queryByText } = render(<LandingPage />);
    fireEvent.press(getByTestId('selectButton'));
    await findByTestId('deleteButton-0');
    fireEvent.press(getByTestId('deleteButton-0'));

    const certificate = queryByText('certificate1.pdf');
    expect(certificate).toBeNull();
  });
});
