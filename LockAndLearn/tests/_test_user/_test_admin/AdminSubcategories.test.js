import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AdminSubcategories from '../../../screens/User/Admin/AdminSubcategories';

describe('AdminSubcategories', () => {
  it('renders correctly', () => {
    const { getByText } = render(<AdminSubcategories />);
    expect(getByText('Subcategories')).toBeTruthy();
  });

});
