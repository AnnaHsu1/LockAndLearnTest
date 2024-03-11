// ViewPurchasedMaterial.test.js
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ViewPurchasedMaterial from '../../../screens/User/Child/ViewPurchasedMaterial';
import { getItem } from '../../../components/AsyncStorage'; // adjust the import path as needed

// Mocks
jest.mock('../../../components/AsyncStorage', () => ({
  getItem: jest.fn(),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(mockResponse),
  })
);

describe('ViewPurchasedMaterial', () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    fetch.mockClear();
    getItem.mockClear();
  });

  it('renders correctly', async () => {
    // Mocking getItem to return a valid JSON string
    getItem.mockImplementation(() => Promise.resolve(JSON.stringify({ _id: 'user123' })));

    const { findByText } = render(<ViewPurchasedMaterial />);

    // Assuming 'Owned Work Packages' is a text that appears after the component successfully renders
    const textElement = await findByText('Owned Work Packages');
    expect(textElement).toBeTruthy();
  });

  test('fetches work packages on mount', async () => {
    render(<ViewPurchasedMaterial />);
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('fetchWorkPackagesParent'),
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
    });
  });
  

});

