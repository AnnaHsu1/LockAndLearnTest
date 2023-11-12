import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ChildProfileScreen from '../screens/User/Child/ChildProfileScreen';
import AsyncStorage from '../components/AsyncStorage';

const mockChild = {
  _id: 'child123',
  firstName: 'John',
  lastName: 'Doe',
  grade: '1',
  parentId: 'parent123',
};

// Mock navigation and AsyncStorage
const mockNavigation = {
  navigate: jest.fn(),
};

const mockRoute = {
  params: {
    child: mockChild,
  },
};

jest.mock('../components/AsyncStorage', () => ({
  getItem: jest.fn(() => Promise.resolve(JSON.stringify({ _id: 'parent123' }))),
}));

// Mock fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
    status: 200,
  })
);

describe('Child Profile Screen test', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Render and test each button', () => {
    const { getByTestId } = render(
      <ChildProfileScreen navigation={mockNavigation} route={mockRoute} />
    );
    const startSessionButton = getByTestId('start-session');
    const editProfileButton = getByTestId('edit-profile');
    const seePerformanceButton = getByTestId('see-performance');
    const deleteProfileButton = getByTestId('delete-child-link');

    expect(startSessionButton).toBeTruthy();
    expect(editProfileButton).toBeTruthy();
    expect(seePerformanceButton).toBeTruthy();
    expect(deleteProfileButton).toBeTruthy();
  });

  it('Attempts to start a session', () => {
    const { getByTestId } = render(
      <ChildProfileScreen navigation={mockNavigation} route={mockRoute} />
    );
    const startSessionButton = getByTestId('start-session');
    fireEvent.press(startSessionButton);
    expect(mockNavigation.navigate).toBeCalledWith('Locking');
  });

  it('Attempts to edit a child profile', () => {
    const { getByTestId } = render(
      <ChildProfileScreen navigation={mockNavigation} route={mockRoute} />
    );
    const editProfileButton = getByTestId('edit-profile');
    fireEvent.press(editProfileButton);
    expect(mockNavigation.navigate).toBeCalledWith('EditChild', { child: mockChild });
  });

  it('Attempts to see a child performance', () => {
    const { getByTestId } = render(
      <ChildProfileScreen navigation={mockNavigation} route={mockRoute} />
    );
    const seePerformance = getByTestId('see-performance');
    fireEvent.press(seePerformance);
  });

  it('Attempts to delete a child profile', async () => {
    const { getByTestId } = render(
      <ChildProfileScreen navigation={mockNavigation} route={mockRoute} />
    );

    // Delete child but cancel
    const deleteProfileButton = getByTestId('delete-child-link');
    fireEvent.press(deleteProfileButton);
    expect(getByTestId('delete-child-modal')).toBeTruthy();
    fireEvent.press(getByTestId('close-modal-button'));

    // Delete child and confirm
    fireEvent.press(deleteProfileButton);
    fireEvent.press(getByTestId('delete-child-button'));

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:4000/child/deletechild/' + mockChild._id,
        {
          method: 'DELETE',
        }
      )
    );
    expect(mockNavigation.navigate).toHaveBeenCalledWith('ParentAccount', {
      updatedChildren: null,
    });
  });
});
