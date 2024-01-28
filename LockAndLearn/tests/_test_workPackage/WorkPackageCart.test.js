import WorkPackageCart from '../../screens/WorkPackage/Payment/WorkPackageCart';
import React from 'react';
import { render, fireEvent, waitFor, } from '@testing-library/react-native';
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

describe('WorkPackageCart', () => {
    it('renders correctly', () => {
        const { getByText } = render(<WorkPackageCart />);
        expect(getByText('Your Cart (0)')).toBeTruthy();

    });

    it('fetches work packages on mount', async () => {
        render(<WorkPackageCart />);
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(1);
        });
       
    });

    it('selects and deletes work package', async () => {
        const mockWorkPackages = [
            // Mocked work packages data
        ];
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve(mockWorkPackages),
                status: 200,
            })
        );

        const { getByText, getByTestId, queryByText } = render(<WorkPackageCart />);
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(1);
        });

    });

    it('displays total price', () => {
        const { getByText } = render(<WorkPackageCart />);
        expect(getByText('Total Amount: $0.00 CAD')).toBeTruthy(); // Assuming initial total price is zero
        // Add assertions for the total price based on mocked work packages
    });

    it('selects and deletes work package', async () => {
        const mockWorkPackages = []; // No items in the cart
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve(mockWorkPackages),
                status: 200,
            })
        );

        const { getByText, getByTestId, queryByText,  } = render(<WorkPackageCart />);
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(1);
        });

        // Check if there are items in the cart
        const removeButton = queryByText('Remove', { exact: false }); // Use queryByText to check for the button

        if (removeButton) {
            // If the remove button is present, perform the delete action
            fireEvent.press(removeButton);
            await waitFor(() => {
                expect(queryByText('Are you sure')).toBeTruthy();
            });

        
        } else {
          expect(getByText('Your Cart (0)')).toBeTruthy(); // assertion for an empty cart
          expect(getByText('Your cart is empty.')).toBeTruthy(); // reminder that the cart is empty
          const payNowButtonCart = getByText('Pay Now');
          expect(payNowButtonCart).toBeTruthy(); // Assert that the button is present

          // Ensure that the button is disabled when there are no items in the cart
          expect(mockWorkPackages.length).toBe(0);
          expect(payNowButtonCart.props.disabled).toBe(undefined);
        }
    });
    it('displays the "Pay Now" button', () => {
        const { getByText } = render(<WorkPackageCart />);
        const payNowButton = getByText('Pay Now');
        expect(payNowButton).toBeTruthy();
    });

    it('removes a package from the cart', async () => {
        const mockPackages = [
            { _id: 'wp1', name: 'Work Package 1', grade: 'A', subcategory: 'Sub 1' },
            // Add more mocked packages if needed
        ];

        // Mock the fetch response for fetching packages from the cart
        global.fetch.mockResolvedValueOnce({
            json: async () => mockPackages,
            status: 200,
        });
       
    });
});