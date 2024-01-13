import Payment from '../../screens/WorkPackage/Payment';
import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';
import { Linking } from 'react-native'; // Import Linking from 'react-native'


// Mocking modules and navigation
jest.mock('@react-navigation/native', () => ({
    useNavigation: jest.fn(),
}));

jest.mock('../../components/AsyncStorage', () => ({
    getItem: jest.fn(() => Promise.resolve(JSON.stringify({ _id: '123' }))),
}));

jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'), // Use actual implementation of other methods if needed
    useNavigation: jest.fn(),
}));

useNavigation.mockReturnValue({
    setParams: jest.fn(), // Mock the setParams method or other necessary methods
    // Other necessary navigation methods and properties...
});

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve([]), // Mock empty array for initial fetch
        status: 200,
    })
);

describe('Payment Screen', () => {
    beforeEach(() => {
        // Clear the fetch mock calls before each test
        fetch.mockClear();
    });

    test('renders payment information correctly', async () => {
        const route = { params: { totalPrice: 50 } };
        const { getByText } = render(<Payment route={route} />);

        // Wait for the fetch logic to complete
        await waitFor(() => expect(getByText('Total Price: $50 CAD')).toBeTruthy());
    });

    test('renders title', async () => {
        const route = { params: { totalPrice: 50 } };
        const { getByText } = render(<Payment route={route} />);

        // Wait for the fetch logic to complete
        await waitFor(() => expect(getByText('Payment Information')).toBeTruthy());
    });
});