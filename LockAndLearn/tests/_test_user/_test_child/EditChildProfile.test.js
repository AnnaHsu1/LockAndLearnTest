import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import EditChildProfileScreen from '../../../screens/User/Child/EditChildProfileScreen';
import AsyncStorage from '../../../components/AsyncStorage';

const mockChild = {
  _id: 'child123',
  firstName: 'John',
  lastName: 'Doe',
  grade: '1',
  parentId: 'parent123',
};

const mockUpdatedChild = [{}];

// Mock navigation and AsyncStorage
const mockNavigation = {
  navigate: jest.fn(),
};

const mockRoute = {
  params: {
    child: mockChild,
  },
};

jest.mock('../../../components/AsyncStorage', () => ({
  getItem: jest.fn(() => Promise.resolve(JSON.stringify({ _id: 'parent123' }))),
}));

// Mock fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
    status: 200,
  })
);

describe('Edit Child Profile Screen test', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Allows user to change the first name, last name and grade inputs', () => {
    const { getByTestId } = render(
      <EditChildProfileScreen navigation={mockNavigation} route={mockRoute} />
    );
    const firstNameInput = getByTestId('first-name-input');
    const lastNameInput = getByTestId('last-name-input');
    const gradeInput = getByTestId('grade-input');

    fireEvent.changeText(firstNameInput, 'Doe');
    fireEvent.changeText(lastNameInput, 'John');
    fireEvent(gradeInput, 'onValueChange', '5');

    expect(firstNameInput.props.value).toEqual('Doe');
    expect(lastNameInput.props.value).toEqual('John');
  });

  it('Checks invalid inputs', () => {});
  it('Submits the updated child when button is pressed', async () => {
    const { getByTestId } = render(
      <EditChildProfileScreen navigation={mockNavigation} route={mockRoute} />
    );
    const firstNameInput = getByTestId('first-name-input');
    const lastNameInput = getByTestId('last-name-input');
    const gradeInput = getByTestId('grade-input');

    fireEvent.changeText(firstNameInput, 'Doe');
    fireEvent.changeText(lastNameInput, 'John');
    fireEvent(gradeInput, 'onValueChange', '5');

    fireEvent.press(getByTestId('edit-child-button'));

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        'https://lockandlearn.onrender.com/child/updatechild/' + mockChild._id,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            FirstName: 'Doe',
            LastName: 'John',
            Grade: '5',
            ParentId: 'parent123',
          }),
        }
      )
    );

    // Modal testing
    expect(getByTestId('modal-success')).toBeTruthy();

    fireEvent.press(getByTestId('close-modal-button'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('ParentAccount', {
      updatedChildren: mockUpdatedChild,
    });
  });
});
