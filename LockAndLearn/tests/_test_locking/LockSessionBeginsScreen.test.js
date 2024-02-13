import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import LockingSessionBeginsScreen from '../../screens/Locking/LockingSessionBeginsScreen';

// Mock useNavigation hook
jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
  };
});

// Mock route with params
const routeMock = {
  params: {
    child_ID: '123',
  },
};

describe('LockingSessionBeginsScreen', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <LockingSessionBeginsScreen route={routeMock} />
      </NavigationContainer>
    );

    expect(getByTestId('itsTimeText')).toBeTruthy();
    expect(getByTestId('lockAndLearnText')).toBeTruthy();
    expect(getByTestId('sessionBeginsLogo')).toBeTruthy();
  });

});


