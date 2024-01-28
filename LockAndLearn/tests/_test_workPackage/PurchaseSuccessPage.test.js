import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect'; // Extend Jest expect with custom matchers
import PurchaseSuccessPage from '../../screens/WorkPackage/Payment/PurchaseSuccessPage';

// Mock the navigation and AsyncStorage
const mockNavigate = jest.fn();
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


// Mock NavigationContainer and useNavigation
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
  NavigationContainer: ({ children }) => <>{children}</>,
}));

describe('PurchaseSuccessPage Component', () => {
  test('displays payment success message and check image', () => {
    const { getByText, getByTestId } = render(<PurchaseSuccessPage />);

    // Check if payment success message and check image are rendered
    expect(getByText('Payment Successful!')).toBeTruthy();
    expect(getByTestId('checkImage')).toBeTruthy();
    expect(getByText('Thank you for your purchase')).toBeTruthy();
  });


    it('navigates to different screen when buttons are pressed', () => {
        const { getByText } = render(<PurchaseSuccessPage navigation={mockNavigation} />);

        fireEvent.press(getByText('Return to Dashboard'));
        expect(mockNavigate).toHaveBeenCalledWith('ParentAccount');
    });
});