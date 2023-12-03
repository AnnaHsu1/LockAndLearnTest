import React from 'react';
import { render, fireEvent, getByTestId, queryByTestId } from '@testing-library/react-native';
import AdminMenu from '../../../screens/User/Admin/AdminMenu';

describe('AdminMenu', () => {
  const mockNavigate = jest.fn();

  const props = {
    route: {},
    navigation: {
      navigate: mockNavigate,
    },
  };

  it('renders correctly', () => {
    const { getByTestId } = render(<AdminMenu {...props} />);
    expect(getByTestId('admin-accounts')).toBeTruthy();
    expect(getByTestId('admin-finance')).toBeTruthy();
    // Continue for other elements
  });

  it('navigates on button press', () => {
    const { getByTestId } = render(<AdminMenu {...props} />);
    fireEvent.press(getByTestId('admin-accounts'));
    expect(mockNavigate).toHaveBeenCalledWith('AdminAccount');
    // Continue for other navigation buttons
  });


});
