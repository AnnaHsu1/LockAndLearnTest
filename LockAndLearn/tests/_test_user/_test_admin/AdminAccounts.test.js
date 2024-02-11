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

    it('opens suspension confirmation modal when "Suspend" button is clicked', async () => {
      // Mocking users data
      const mockUsers = [
          { _id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', birthDate: '1990-01-01' },
          // Add more mock users as needed
      ];
  
      // Mocking the fetch response
      fetch.mockResponseOnce(JSON.stringify(mockUsers));
  
      const { getByText, getByTestId } = render(<AdminAccount />);
  
      // Wait for the component to render with users
      await waitFor(() => {
          mockUsers.forEach(user => {
              expect(getByText(`${user.firstName} ${user.lastName}`)).toBeTruthy();
              expect(getByText(`Email: ${user.email}`)).toBeTruthy();
              expect(getByText(`Birthday: ${user.birthDate}`)).toBeTruthy();
          });
      });
  
      // Find and click the "Suspend" button
      const suspendButton = getByText('Suspend');
      fireEvent.press(suspendButton);
  });
  

});

