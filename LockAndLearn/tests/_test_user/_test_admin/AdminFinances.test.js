import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AdminFinances from '../../../screens/User/Admin/AdminFinances';
import { queryByTestId } from '@testing-library/react-native';

describe('AdminFinances Component', () => {
  it('renders correctly', () => {
    const { getByText, getByTestId } = render(<AdminFinances />);
    
    // Check if the main view is rendered
    expect(getByTestId('main-view')).toBeTruthy();

    // Check for the title
    expect(getByText('Finances')).toBeTruthy();
  });

  it('fetches transactions and displays them correctly', async () => {
    const mockTransactions = [
      { id: 1, amount: 1000, currency: 'USD', status: 'completed', created: 1629878400, client_secret: 'secret1' },
      { id: 2, amount: 2000, currency: 'USD', status: 'pending', created: 1629878400, client_secret: 'secret2' },
    ];

    global.fetch = jest.fn().mockImplementation((url) => {
      if (url === 'http://localhost:4000/payment/transactions') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ payments: mockTransactions }),
        });
      }
    });

    const { getByText, findByText } = render(<AdminFinances />);

    await waitFor(() => {
      expect(getByText('Transaction ID: 1')).toBeTruthy();
      expect(getByText('Amount: 10 USD')).toBeTruthy();
      expect(getByText('Status: completed')).toBeTruthy();
      expect(getByText('Transaction ID: 2')).toBeTruthy();
      expect(getByText('Amount: 20 USD')).toBeTruthy();
      expect(getByText('Status: pending')).toBeTruthy();
    });
  });

  it('fetches balance and displays it correctly', async () => {
    const mockBalance = {
      available: [{ amount: 5000 }],
      pending: [{ amount: 1000 }],
    };

    global.fetch = jest.fn().mockImplementation((url) => {
      if (url === 'http://localhost:4000/payment/balanceAdmin') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ balance: mockBalance }),
        });
      }
    });

    const { getByText } = render(<AdminFinances />);

    await waitFor(() => {
      expect(getByText('Balance: $ 60')).toBeTruthy();
    });
  });

});