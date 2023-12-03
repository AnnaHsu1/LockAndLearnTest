import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AdminAccount from '../../../screens/User/Admin/AdminAccounts';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

beforeEach(() => {
    fetch.resetMocks();
});

describe('AdminAccount Component', () => {

    // Mock users data
    const mockUsers = [
        { _id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', birthDate: '1990-01-01' },
        // ... other test users
    ];

    beforeEach(() => {
        fetch.mockResponseOnce(JSON.stringify(mockUsers));
      });

    it('fetches users and displays them on mount', async () => {
        const users = [
            { _id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', birthDate: '1990-01-01' },
            // ... other test users
        ];

        fetch.mockResponseOnce(JSON.stringify(users));

        const { getByText } = render(<AdminAccount />);

        await waitFor(() => {
            users.forEach(user => {
                expect(getByText(`${user.firstName} ${user.lastName}`)).toBeTruthy();
                expect(getByText(`Email: ${user.email}`)).toBeTruthy();
                expect(getByText(`Birthday: ${user.birthDate}`)).toBeTruthy();
            });
        });
    });

    it('opens and closes the modal correctly', async () => {
        const { getByText, queryByText, findAllByText } = render(<AdminAccount />);
    
        // Wait for a specific user to be rendered
        await waitFor(() => {
          expect(getByText(`${mockUsers[0].firstName} ${mockUsers[0].lastName}`)).toBeTruthy();
        });
    
        const deleteButtons = await findAllByText('Delete');
        expect(deleteButtons.length).toBeGreaterThan(0);
    
        // Interact with the first 'Delete' button found
        fireEvent.press(deleteButtons[0]);
        expect(queryByText('Are you sure you want to delete this user?')).toBeTruthy();
    
        // Close the modal
        fireEvent.press(getByText('Cancel'));
    
        // Verify the modal is closed
        await waitFor(() => {
          expect(queryByText('Are you sure you want to delete this user?')).toBeNull();
        });
      });
    // Add more tests here for deleting a user, handling errors, etc.
});

