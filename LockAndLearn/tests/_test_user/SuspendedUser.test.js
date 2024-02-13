import React from 'react';
import { render } from '@testing-library/react-native';
import SuspendedUser from '../../screens/User/SuspendedUser';

describe('SuspendedUser Component', () => {
  it('renders correctly', () => {
    const { getByText } = render(<SuspendedUser />);
    expect(getByText('Your account has been suspended')).toBeTruthy();
  });

  // Add more tests here as needed, for example, testing responsive styles or interactions
});
