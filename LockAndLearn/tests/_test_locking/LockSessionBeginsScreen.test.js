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
    const { getByTestId, queryByText } = render(<LockingSessionBeginsScreen />);

    // checks that all text that should be visible is rendered
    expect(getByTestId('itsTimeText')).toBeDefined();
    expect(getByTestId('lockAndLearnText')).toBeDefined();
    expect(getByTestId('sessionBeginsLogo')).toBeDefined();
    expect(getByTestId('endSessionButton')).toBeDefined();

    // this should not yet be visible
    expect(queryByText('Enter Password:')).toBeNull();
  });
  it('should render End Session components after clicking button', () => {
    const { getByTestId, queryByText } = render(<LockingSessionBeginsScreen />);

    // simulate a click on the "End Session" button
    fireEvent.press(getByTestId('endSessionButton'));

    // after clicking on the button, checks that all the components in the End Session Modal are visible
    expect(getByTestId('endSessionModal')).toBeDefined();
    expect(getByTestId('enterPasswordText')).toBeDefined();
    expect(getByTestId('passwordInput')).toBeDefined();
    expect(getByTestId('profileImage')).toBeDefined();
  });
});
