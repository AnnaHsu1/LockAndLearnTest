import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import MoreInfo from '../../../screens/User/Child/MoreInfo'; // Adjust the import path as necessary
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

beforeEach(() => {
  fetch.resetMocks();
});

const mockRoute = {
  params: {
    child: { _id: 'child1', firstName: 'John' },
    workPackage: { _id: 'wp1' }
  },
};

const mockNavigation = {
  navigate: jest.fn(),
};

describe('<MoreInfo />', () => {
    it('renders correctly and displays child details', async () => {
        const { getByText } = render(<MoreInfo route={mockRoute} navigation={mockNavigation} />);
        
        expect(getByText('Details for John')).toBeTruthy();
        expect(getByText('on Subject - Grade 10')).toBeTruthy();
    });

  it('handles loading states correctly', async () => {
    fetch.mockResponses(
      [JSON.stringify([]), { status: 200 }],
      [JSON.stringify([]), { status: 201 }]
    );

    const { getByText } = render(<MoreInfo route={mockRoute} navigation={mockNavigation} />);

    expect(getByText('Loading grade...')).toBeTruthy();
    expect(getByText('Loading quizzes...')).toBeTruthy();

  });

  it('handles empty data response correctly', async () => {
    fetch.mockResponseOnce(JSON.stringify([])); // Empty array response
  
    render(<MoreInfo route={mockRoute} navigation={mockNavigation} />);
  
    await waitFor(() => {
      // Verify states are not updated
      expect(status).toEqual("");
  
    });
  });

  it('handles fetch error correctly', async () => {
    fetch.mockReject(new Error('Network error'));
  
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  
    render(<MoreInfo route={mockRoute} navigation={mockNavigation} />);
  
    await waitFor(() => {
      // Expect an error to be logged to the console
      expect(consoleErrorSpy).toHaveBeenCalledWith('Network error:', expect.any(Error));
  
      // Optionally, check if any error handling state or UI is updated
      // For example, if there's an `isError` state, check if it's set to true
    });
  
    consoleErrorSpy.mockRestore();
  });

  // Add more tests to cover different scenarios, such as error handling, edge cases, etc.
});
