import WorkPackageOverview from "../../screens/WorkPackage/WorkPackageOverview";
import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';

// Mocking modules and navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('../../components/AsyncStorage', () => ({
  getItem: jest.fn(() => Promise.resolve(JSON.stringify({ _id: '123' }))),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([]), // Mock empty array for initial fetch
    status: 200,
  })
);

describe('WorkPackageOverview', () => {
  
  it('renders correctly', () => {
    const { getByText } = render(<WorkPackageOverview />);
    expect(getByText('Your Work Packages')).toBeTruthy();
  });

  it('fetches work packages on mount', async () => {
    render(<WorkPackageOverview />);
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('fetchWorkpackages'), expect.anything());
    });
  });

  it('displays a message when no work packages are found', async () => {
    const { getByText } = render(<WorkPackageOverview />);
    await waitFor(() => {
      expect(getByText('No created work packages')).toBeTruthy();
    });
  });

  it('navigates to create work package screen on button press', () => {
    const navigate = jest.fn();
    useNavigation.mockImplementation(() => ({ navigate }));

    const { getByTestId } = render(<WorkPackageOverview />);
    fireEvent.press(getByTestId('uploadButton'));
    expect(navigate).toHaveBeenCalledWith('CreateWorkPackage', {
      workPackage: 'nameofworkpackage',
    });
  });

  it('opens confirmation modal on delete button press', async () => {
    // Mock data for work packages
    const mockWorkPackages = [
      { _id: 'wp1', name: 'Work Package 1', grade: 'A', subcategory: 'Sub 1' },
      // ... add more mock work packages as needed
    ];

    // Mock fetch response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockWorkPackages),
        status: 200,
      })
    );

    const { getByTestId } = render(<WorkPackageOverview />);

    // Wait for mock work packages to be rendered
    await waitFor(() => {
      expect(getByTestId('deleteButton-wp1')).toBeTruthy();
    });

    // Simulate pressing the delete button
    fireEvent.press(getByTestId('deleteButton-wp1'));

    // Check if the confirmation modal is visible
    // Assuming the modal has a testID 'deleteConfirmationModal'
    const modal = getByTestId('deleteConfirmationModal');
    expect(modal).toBeTruthy();
  });

});

