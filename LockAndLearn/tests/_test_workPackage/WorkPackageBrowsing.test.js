import WorkPackageBrowsing from '../../screens/WorkPackage/WorkPackageBrowsing';
import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

// Mocking modules and navigation
jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: jest.fn(),
    useRoute: jest.fn(),
  }));

jest.mock('../../components/AsyncStorage', () => ({
    getItem: jest.fn(() => Promise.resolve(JSON.stringify({ _id: '123' }))),
}));

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve([]), // Mock empty array for initial fetch
        status: 200,
    })
);

describe('WorkPackageBrowsing', () => {
    
    beforeEach(() => {
        useNavigation.mockReturnValue({
          navigate: jest.fn(),
        });
    
      });

    const mockedParameters = {
        route: {
            params: {
                removedWP: 'WPid-to-be-removed',
            },
        },
    };

    it('renders correctly', () => {
        const { getByText } = render(<WorkPackageBrowsing {...mockedParameters}/>);
        expect(getByText('Explore')).toBeTruthy();
    });

    it('fetches work packages and cart on mount', async () => {
        render(<WorkPackageBrowsing {...mockedParameters}/>);
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(2);
        });
    });

    it('displays work packages properly and adds to cart', async () => {
        const mockWorkPackages = [
            { _id: 'wp1', name: 'Work Package 1', grade: 'A', subcategory: 'Sub 1' },
        ];
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve(mockWorkPackages),
                status: 200,
            })
        );

        const { getByText, getByTestId } = render(<WorkPackageBrowsing {...mockedParameters} />);
        await waitFor(() => {
            expect(getByText('Work Package 1 - A - Sub 1')).toBeTruthy();
        });

        const addToCartButton = getByTestId('addButton-wp1');
        fireEvent.press(addToCartButton);

        await waitFor(() => {
            expect(getByText('Added to Cart')).toBeTruthy(); // Check after pressing, should be 'Added to Cart'
        });

        // Ensure the 'Added to Cart' text is present before checking for 'Add' text
        fireEvent.press(addToCartButton);
        await waitFor(() => {
            expect(getByText('Added to Cart')).toBeTruthy(); // Check the initial state, should be 'Add'
        });

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(2); // Ensure fetch was called for adding to the cart
        });
    });

    it('navigates to cart screen on button press', () => {
        const navigate = jest.fn();
        useNavigation.mockImplementation(() => ({ navigate }));
        const { getByTestId } = render(<WorkPackageBrowsing {...mockedParameters}/>);
        fireEvent.press(getByTestId('viewCartButton'));
        expect(navigate).toHaveBeenCalledWith('WorkPackageCart');
    });
});