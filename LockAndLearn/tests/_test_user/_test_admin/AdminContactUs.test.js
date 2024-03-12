import AdminContactUs from '../../../screens/User/Admin/AdminContactUs';

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';


// Mock global.fetch
global.fetch = jest.fn((url) => {
    if (url.includes('/getContactUs')) {
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([
                { _id: '1', name: 'John Doe', email: 'john@example.com', subject: 'Test Subject', message: 'Test Message' }
            ]),
        });
    } else if (url.includes('/deleteContactUs')) {
        return Promise.resolve({
            ok: true,
        });
    }
    return Promise.reject(new Error('Unknown endpoint'));
});

const mockedNavigate = jest.fn();
const mockedRoute = {};

describe('AdminContactUs Component', () => {

    beforeEach(() => {
        fetch.mockClear();
        mockedNavigate.mockClear();
    });

    it('renders correctly', () => {
        const { getByText } = render(<AdminContactUs route={mockedRoute} navigation={{ navigate: mockedNavigate }} />);
        expect(getByText('Inquiries')).toBeTruthy();
    });

    it('fetches contact us inquiries on mount', async () => {
        render(<AdminContactUs route={mockedRoute} navigation={{ navigate: mockedNavigate }} />);
        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    });

    it('handles error during data fetching', async () => {
        // Mock fetch to simulate an error
        fetch.mockImplementationOnce(() => Promise.reject('Network error'));

        const { getByText } = render(<AdminContactUs route={mockedRoute} navigation={{ navigate: mockedNavigate }} />);
        const errorText = getByText('Inquiries');

        expect(errorText).toBeTruthy();
        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1)); // Wait for data fetch
    });


    it('fetches inquiries when the component mounts', async () => {
        render(<AdminContactUs route={mockedRoute} navigation={{ navigate: mockedNavigate }} />);
        await waitFor(() => expect(fetch).toHaveBeenCalledWith(
            'https://data.mongodb-api.com/app/lock-and-learn-xqnet/endpoint/getContactUs',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ));
    });
});

