import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AdminViewTeacherProfile from '../../../screens/User/Admin/AdminViewTeacherProfile';

// Mocking fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([]),
    status: 200,
  })
);

describe('AdminViewTeacherProfile component', () => {
  it('renders correctly', async () => {
    const { getByText, queryAllByTestId } = render(<AdminViewTeacherProfile route={{ params: { userId: 'testUserId' } }} navigation={{ navigate: jest.fn() }} />);
    
    // Expect the title to be rendered
    expect(getByText('Created Work Packages')).toBeTruthy();

    // Expect no work packages initially
    expect(queryAllByTestId('workPackageBox')).toHaveLength(0);
  });

  it('fetches work packages on mount', async () => {
    render(<AdminViewTeacherProfile route={{ params: { userId: 'testUserId' } }} navigation={{ navigate: jest.fn() }} />);
    
    // Expect fetch to be called with correct URL
    expect(fetch).toHaveBeenCalledWith('https://lockandlearn.onrender.com/workPackages/getWorkPackages/testUserId', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  it('displays fetched work packages', async () => {
    const mockWorkPackages = [
      { _id: '1', name: 'Work Package 1', grade: 10, description: 'Description 1', instructorDetails: { firstName: 'John', lastName: 'Doe' } },
      { _id: '2', name: 'Work Package 2', grade: 11, description: 'Description 2', instructorDetails: { firstName: 'Jane', lastName: 'Smith' } }
    ];

    fetch.mockResolvedValueOnce({ json: () => Promise.resolve(mockWorkPackages), status: 200 });

    const { getByText } = render(<AdminViewTeacherProfile route={{ params: { userId: 'testUserId' } }} navigation={{ navigate: jest.fn() }} />);
    
    // Expect work package names to be rendered
    await waitFor(() => expect(getByText('Work Package 1')).toBeTruthy());
    await waitFor(() => expect(getByText('Work Package 2')).toBeTruthy());
  });

  it('navigates to WorkPackagePreview on pressing Preview button', async () => {
    const mockWorkPackage = { _id: '1', name: 'Work Package 1', grade: 10, description: 'Description 1', instructorDetails: { firstName: 'John', lastName: 'Doe' } };

    fetch.mockResolvedValueOnce({ json: () => Promise.resolve([mockWorkPackage]), status: 200 });

    const navigateMock = jest.fn();
    const { getByText } = render(<AdminViewTeacherProfile route={{ params: { userId: 'testUserId' } }} navigation={{ navigate: navigateMock }} />);
    
    // Wait for work package to be rendered
    await waitFor(() => expect(getByText('Work Package 1')).toBeTruthy());

    // Press the Preview button
    fireEvent.press(getByText('Preview'));

    // Expect navigation to WorkPackagePreview with correct params
    expect(navigateMock).toHaveBeenCalledWith('WorkPackagePreview', { workPackage: mockWorkPackage });
  });

});
