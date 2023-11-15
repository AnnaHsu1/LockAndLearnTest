import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LockingSessionBeginsScreen from '../../screens/Locking/LockingSessionBeginsScreen';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
  }),
}));

describe('LockingSessionBeginsScreen', () => {
  it('should render static components intially', () => {
    const { getByTestId } = render(<LockingSessionBeginsScreen />);

    // checks that all text that should be visible is rendered
    expect(getByTestId('itsTimeText')).toBeDefined();
    expect(getByTestId('lockAndLearnText')).toBeDefined();
    expect(getByTestId('sessionBeginsLogo')).toBeDefined();
  });
});
