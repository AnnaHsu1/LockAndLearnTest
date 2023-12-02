import WorkPackageOverview from '../../screens/WorkPackage/WorkPackageOverview';
import React from 'react';
import { render, fireEvent, waitFor, act, getByTestId } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';

// Mocking modules and navigation
jest.mock('@react-navigation/native', () => {
  const addListener = jest.fn((event, callback) => {
    if (event === 'focus') {
      callback();
    }
    return jest.fn(); // mock return for unsubscribe
  });

  return {
    useNavigation: () => ({
      addListener,
      navigate: jest.fn(),
    }),
  };
});

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
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('fetchWorkpackages'),
        expect.anything()
      );
    });
  });

  it('displays a message when no work packages are found', async () => {
    const { getByText } = render(<WorkPackageOverview />);
    await waitFor(() => {
      expect(getByText('No created work packages')).toBeTruthy();
    });
  });

  // it('navigates to create work package screen on button press', () => {
  //   const { getByTestId } = render(<WorkPackageOverview />);
  //   fireEvent.press(getByTestId('uploadButton'));
  
  //   // Access the mock navigate function from useNavigation
  //   const navigationMock = useNavigation();
  //   expect(navigationMock.navigate).toHaveBeenCalledWith('CreateWorkPackage', {
  //     workPackage: 'nameofworkpackage',
  //   });
  // });
  

  // it('opens confirmation modal on delete button press', async () => {
  //   // Mock data for work packages
  //   const mockWorkPackages = [
  //     { _id: 'wp1', name: 'Work Package 1', grade: 'A', subcategory: 'Sub 1' },
  //     // ... add more mock work packages as needed
  //   ];

  //   // Mock fetch response
  //   global.fetch = jest.fn(() =>
  //     Promise.resolve({
  //       json: () => Promise.resolve(mockWorkPackages),
  //       status: 200,
  //     })
  //   );
  // it('displays edit button for each workpackage', async () => {
  //   const navigate = jest.fn();
  //   useNavigation.mockImplementation(() => ({ navigate }));
  //   const mockWorkPackages = [
  //     { _id: 'wp1', name: 'Work Package 1', grade: 'A', subcategory: 'Sub 1' },
  //   ];
  //   global.fetch = jest.fn(() =>
  //     Promise.resolve({
  //       json: () => Promise.resolve(mockWorkPackages),
  //       status: 200,
  //     })
  //   );
  //   const { getByTestId } = render(<WorkPackageOverview />);
  //   await waitFor(() => {
  //     expect(getByTestId('editButton-wp1')).toBeTruthy();
  //   });
  //   fireEvent.press(getByTestId('editButton-wp1'));
  //   expect(navigate).toHaveBeenCalledWith('DisplayWorkPackageContent', {
  //     workPackageId: 'wp1',
  //   });
  // });

  it('displays price for each workpackage', async () => {
    const mockWorkPackages = [
      { _id: 'wp1', name: 'Work Package 1', grade: 'A', subcategory: 'Sub 1', price: 1 },
    ];
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockWorkPackages),
        status: 200,
      })
    );
    const { getByTestId } = render(<WorkPackageOverview />);
    await waitFor(() => {
      expect(getByTestId('price-wp1')).toBeTruthy();
    });
  });

  it('opens confirmation modal on delete button press', async () => {
    const { getByTestId } = render(<WorkPackageOverview />);
  
    // Wait for the component to render and for the delete button to become available
    await waitFor(() => {
      expect(getByTestId(`deleteButton-wp1`)).toBeTruthy();
    });
  
    // Simulate pressing the delete button
    fireEvent.press(getByTestId('deleteButton-wp1'));
  
    // Check if the confirmation modal is visible
    // Assuming the modal has a testID 'deleteConfirmationModal'
    const modal = getByTestId('deleteConfirmationModal');
    expect(modal).toBeTruthy();
  });
  
});
