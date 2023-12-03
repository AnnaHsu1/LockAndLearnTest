import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AdminFinances from '../../../screens/User/Admin/AdminFinances';

describe('AdminFinances Component', () => {
  it('renders correctly', () => {
    const { getByText, getByTestId } = render(<AdminFinances />);
    
    // Check if the main view is rendered
    expect(getByTestId('main-view')).toBeTruthy();

    // Check for the title
    expect(getByText('Finances')).toBeTruthy();

    // Add more assertions as needed
  });

  // Additional tests can be added here, such as testing the modal logic, etc.
});
