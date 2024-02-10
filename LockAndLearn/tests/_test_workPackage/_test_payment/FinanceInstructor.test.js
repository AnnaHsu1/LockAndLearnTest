import React from 'react';
import { render, fireEvent, waitFor, act, } from '@testing-library/react-native';
import FinanceInstructor from '../../../screens/WorkPackage/Payment/FinanceInstructor';

// Mock the fetch function
global.fetch = require('jest-fetch-mock');

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => {
  return {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  };
});

describe('FinanceInstructor component', () => {
  it('main view renders correctly', () => {
    const { getByTestId } = render(<FinanceInstructor navigation={{}} route={{}} />);
    
    // Assert that the component renders the main view
    expect(getByTestId('main-view')).toBeTruthy();
  });

  it('unregistered view renders correctly', async () => {
    // Mock the fetch response for getWorkPackages
    fetch.mockResponseOnce(JSON.stringify([{ _id: '1', name: 'Work Package 1' }]));

    const { getByText } = render(<FinanceInstructor navigation={{}} route={{}} />);

    // Wait for the component to render
    await waitFor(() => {
      // Assert that it displays the work package name
      expect(getByText('Finance Setup')).toBeTruthy();
      expect(getByText('Get started by setting up your Stripe Account.')).toBeTruthy();
      expect(getByText('Create Setup Link')).toBeTruthy();
      expect(getByText('* Please note that without a registered Stripe account, we will not be able to transfer the profits to you.')).toBeTruthy();
    });
  });
/* 
  it('registered view renders correctly', async () => {

    // Mock getItem and setItem functions
    jest.spyOn(require('@react-native-async-storage/async-storage'), 'getItem').mockResolvedValueOnce(JSON.stringify({ _id: 'user123' }));
    jest.spyOn(require('@react-native-async-storage/async-storage'), 'setItem').mockResolvedValueOnce(null);

    // Mock the response for checkStripeCapabilities
    fetch.mockResponseOnce(
      JSON.stringify({ hasCardPaymentsCapability: true, hasTransfersCapability: true }),
      { status: 200 }
    );

    // Advance timers to ensure the mock response takes effect
    jest.runAllTimers();

    const { getByText } = render(<FinanceInstructor navigation={{}} route={{}} />);
    
    // Wait for the component to render
    await waitFor(() => {
      // Assert that it displays the balance
      expect(getByText('My Finance Dashboard')).toBeTruthy();
    });
  });

  it('fetches and displays balance', async () => {
    // Mock getItem and setItem functions
    jest.spyOn(require('@react-native-async-storage/async-storage'), 'getItem').mockResolvedValueOnce(JSON.stringify({ _id: 'user123' }));
    jest.spyOn(require('@react-native-async-storage/async-storage'), 'setItem').mockResolvedValueOnce(null);

    // Mock the response for checkStripeCapabilities
    fetch.mockResponseOnce(
      JSON.stringify({ hasCardPaymentsCapability: true, hasTransfersCapability: true }),
      { status: 200 }
    );

    // Mock the fetch response for fetchBalance
    fetch.mockResponseOnce(
      JSON.stringify({ revenue: 100}),
      { status: 200 }
    );

    // Advance timers to ensure the mock response takes effect
    jest.runAllTimers();

    const { getByText } = render(<FinanceInstructor navigation={{}} route={{}} />);
    
    // Wait for the component to render
    await waitFor(() => {
      // Assert that it displays the balance
      expect(getByText('Total revenue: $')).toBeTruthy();
    });
  }); */

  /* it('generates Stripe setup link', async () => {
    // Mock the fetch response for generateStripeSetupLink

     // Mock the fetch response for checkStripeCapabilities
     fetch.mockResponseOnce(
      JSON.stringify({ hasCardPaymentsCapability: false, hasTransfersCapability: false }),
      { status: 200 }
    );

    //Mock stripe setup link response
    fetch.mockResponseOnce(JSON.stringify({ url: 'https://stripe-setup-link' }));


    const { getByText } = render(<FinanceInstructor navigation={{}} route={{}} />);
    
    // Wait for the component to render
  await act(async () => {
    // Find the button and click it
    const button = getByText('Create Setup Link');
    fireEvent.press(button);
  });

    // Wait for the component to render after generating the link
    await waitFor(() => {
      // Assert that it displays the generated URL
      expect(getByText('Stripe Link Generated')).toBeTruthy();
    });
  }); */

  // Add more tests for other functions and scenarios as needed

});