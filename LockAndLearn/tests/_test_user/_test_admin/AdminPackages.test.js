import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AdminPackages from '../../../screens/User/Admin/AdminPackages';

// Mock fetch and any other dependencies or modules you need here

describe('AdminPackages', () => {
  // Mock the fetch function before running tests
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]), // Mock the response data here
    })
  );

  it('renders without crashing', () => {
    const { getByText } = render(<AdminPackages route={{ params: {} }} navigation={{}} />);
    const titleElement = getByText('Packages');
    expect(titleElement).toBeDefined();
  });

  it('displays "No work packages available" when there are no packages', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });
    
    const { getByText } = render(<AdminPackages route={{ params: {} }} navigation={{}} />);
    const noWorkPackagesText = await getByText('No packages available');
    expect(noWorkPackagesText).toBeDefined();
  });

  // Clean up the fetch mock after all tests are done
  afterAll(() => {
    global.fetch.mockClear();
  });
});
