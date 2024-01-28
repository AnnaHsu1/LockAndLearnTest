import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CreatePackage from '../../../screens/WorkPackage/Package/CreatePackage';

// Mocks
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => jest.fn(),
  useRoute: () => ({ params: { workPackage: { _id: '1', name: 'Test Package', grade: 10 } } }),
}));

describe('<CreatePackage />', () => {
  const mockNavigation = jest.fn();
  const mockRoute = {
    params: { workPackage: { _id: '1', name: 'Test Package', grade: 10 } }
  };

  it('renders correctly', () => {
    const { getByText } = render(<CreatePackage navigation={mockNavigation} route={mockRoute} />);
    expect(getByText('Create New Package')).toBeTruthy();
  });

  it('updates UI when subcategory is selected', async () => {
    const { getByTestId, findByText } = render(<CreatePackage navigation={mockNavigation} route={mockRoute} />);

    const picker = getByTestId('subcategory-picker');
    fireEvent(picker, 'onValueChange', 'New Subcategory');

    // Use findByText for asynchronous elements
    const addButton = await findByText('Add material');

    // Check if the button is now enabled
    expect(addButton.props.disabled).toBe(undefined);
  });

  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(['Subcategory1', 'Subcategory2']),
      status: 200,
    })
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('updates subcategories after fetching', async () => {

    const { findByText } = render(<CreatePackage navigation={mockNavigation} route={mockRoute} />);
    const subcategoryItem = await findByText('Subcategory');
    expect(subcategoryItem).toBeTruthy();

  });

  it('logs error on fetch failure', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'));
    const consoleErrorSpy = jest.spyOn(console, 'error');
  
    render(<CreatePackage navigation={mockNavigation} route={mockRoute} />);
  
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Network error while fetching subcategories');
    });
  
    consoleErrorSpy.mockRestore();
  });

});
