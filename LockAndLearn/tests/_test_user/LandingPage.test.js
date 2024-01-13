import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import LandingPage from '../../screens/User/LandingPage';
import * as DocumentPicker from 'expo-document-picker';
import * as AsyncStorage from '../../components/AsyncStorage';

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

describe('LandingPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const user = { isParent: true }; // example user object

  it('renders different buttons based on user state', async () => {
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify(user));
    const { queryByText, getByText } = render(<LandingPage navigation={mockNavigation} />);

    await act(async () => {});

    // Check for buttons that should be present when user is logged in
    // expect(queryByText('Parent Account')).toBeTruthy();

    // Check for buttons that are always present
    fireEvent.press(getByText('Go to main menu'));
    expect(queryByText('My Work Packages')).toBeTruthy();
    expect(queryByText('My quizzes')).toBeTruthy();
    expect(queryByText('My files')).toBeTruthy();
  });

  it('navigates to different screens when buttons are pressed', () => {
    const { getByText } = render(<LandingPage navigation={mockNavigation} />);
    fireEvent.press(getByText('Go to main menu'));

    fireEvent.press(getByText('My Work Packages'));
    expect(mockNavigate).toHaveBeenCalledWith('WorkPackage');

    fireEvent.press(getByText('My quizzes'));
    expect(mockNavigate).toHaveBeenCalledWith('QuizzesOverviewScreen', {
      userId: null,
    });

    fireEvent.press(getByText('My files'));
    expect(mockNavigate).toHaveBeenCalledWith('ViewUploads', {
      newFilesAdded: undefined,
    });
  });
});

describe('tests for certificates upload', () => {
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
  });

  it('handles certificate selection', async () => {
    DocumentPicker.getDocumentAsync.mockResolvedValue({
      type: 'success',
      output: [{ name: 'certificatetest.pdf' }],
    });

    const { getByTestId } = render(<LandingPage />);
    fireEvent.press(getByTestId('selectButton'));

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
