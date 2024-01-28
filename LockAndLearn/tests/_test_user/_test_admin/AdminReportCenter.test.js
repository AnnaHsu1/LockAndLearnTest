import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AdminReportCenter from '../../../screens/User/Admin/AdminReportCenter';

// Mock global.fetch
global.fetch = jest.fn((url) => {
    if (url.includes('/reports/all-reports')) {
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([{ _id: '1', idOfWp: 'wp1', reporterId: 'user1', reason: 'Reason 1' }]),
        });
    } else if (url.includes('/workPackages/fetchWorkPackageById/')) {
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ name: 'WP Name', grade: 'A', description: 'WP Description', price: 100, packageCount: 1 }),
        });
    } else if (url.includes('/users/getUser/')) {
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ firstName: 'John', lastName: 'Doe', email: 'john@example.com' }),
        });
    }
    return Promise.reject(new Error('Unknown endpoint'));
});

const mockedNavigate = jest.fn();
const mockedRoute = {};

describe('AdminReportCenter Component', () => {

    beforeEach(() => {
        fetch.mockClear();
        mockedNavigate.mockClear();
    });

    it('renders correctly', () => {
        const { getByText } = render(<AdminReportCenter route={mockedRoute} navigation={{ navigate: mockedNavigate }} />);
        expect(getByText('Report Center')).toBeTruthy();
    });

    it('fetches reports on mount', async () => {
        render(<AdminReportCenter route={mockedRoute} navigation={{ navigate: mockedNavigate }} />);
        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    });

    it('handles error during data fetching', async () => {
        // Mock fetch to simulate an error
        fetch.mockImplementationOnce(() => Promise.reject('Network error'));

        const { getByText } = render(<AdminReportCenter route={mockedRoute} navigation={{ navigate: mockedNavigate }} />);
        const errorText = getByText('Report Center');

        expect(errorText).toBeTruthy();
        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1)); // Wait for data fetch
    });

    it('applies responsive styles for different screen sizes', () => {
        // You can use the 'getByTestId' method to access specific elements by their test IDs and check their styles
        const { getByTestId } = render(<AdminReportCenter route={mockedRoute} navigation={{ navigate: mockedNavigate }} />);
        const container = getByTestId('main-view');
    });

    it('fetches reports when the component mounts', async () => {
        render(<AdminReportCenter route={mockedRoute} navigation={{ navigate: mockedNavigate }} />);
        await waitFor(() => expect(fetch).toHaveBeenCalledWith('http://localhost:4000/reports/all-reports'));
    });
     
    

});

