import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AdminWorkPackages from '../../../screens/User/Admin/AdminWorkPackages';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

// Define mock data for work packages
const mockWorkPackagesData = [
    {
      _id: '1',
      name: 'Work Package 1',
      grade: 'A',
      subcategory: 'Math',
      instructorID: 'instructor1',
      quizzes: ['quiz1', 'quiz2'],
      materials: ['material1', 'material2'],
      // ... other necessary fields
    },
    // ... more mock work packages
  ];

describe('AdminWorkPackages', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('renders correctly', () => {
    const { getByText } = render(<AdminWorkPackages />);
    expect(getByText('Work Packages')).toBeTruthy();
  });

  it('fetches work packages on mount', async () => {
    fetch.mockResponseOnce(JSON.stringify([...mockWorkPackagesData]));

    const { findByText } = render(<AdminWorkPackages />);

    await waitFor(() => {
      expect(findByText('Work Package 1')).toBeTruthy();
    });
  });

  it('handles fetch error correctly', async () => {
    fetch.mockReject(() => Promise.reject('API failure'));

    const { findByText } = render(<AdminWorkPackages />);

    await waitFor(() => {
      expect(findByText('Failed to fetch work packages')).toBeTruthy();
    });
  });

  // ... More tests for modal interactions, delete functionality, etc.

});
