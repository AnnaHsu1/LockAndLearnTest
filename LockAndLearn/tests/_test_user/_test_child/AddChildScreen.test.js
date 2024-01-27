import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AddChildScreen from '../../../screens/User/Child/AddChildScreen';
import AsyncStorage from '../../../components/AsyncStorage';

// Mock navigation and AsyncStorage
const mockNavigation = {
  navigate: jest.fn(),
};

jest.mock('../../../components/AsyncStorage', () => ({
  getItem: jest.fn(() => Promise.resolve(JSON.stringify({ _id: 'parent123' }))),
}));

// Mock fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
    status: 201,
  })
);

describe('AddChildScreen', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('allows the user to enter first name, last name, grade, and passing grade', () => {
    const { getByTestId } = render(<AddChildScreen navigation={mockNavigation} setToken={() => {}} />);

    fireEvent.changeText(getByTestId('first-name-input'), 'John');
    fireEvent.changeText(getByTestId('last-name-input'), 'Doe');
    fireEvent.changeText(getByTestId('passing-grade-input'), '60');

    expect(getByTestId('first-name-input').props.value).toEqual('John');
    expect(getByTestId('last-name-input').props.value).toEqual('Doe');
    expect(getByTestId('passing-grade-input').props.value).toEqual('60');
  });

  it('submits the child data with passing grade when the add child button is pressed', async () => {
    const { getByTestId } = render(<AddChildScreen navigation={mockNavigation} setToken={() => {}} />);

    fireEvent.changeText(getByTestId('first-name-input'), 'John');
    fireEvent.changeText(getByTestId('last-name-input'), 'Doe');
    fireEvent.changeText(getByTestId('passing-grade-input'), '60');
    fireEvent.press(getByTestId('signup-button'));

    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:4000/child/addchild',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          FirstName: 'John',
          LastName: 'Doe',
          Grade:'',
          PassingGrade: '60',
          ParentId: 'parent123',
        }),
      }
    ));
  });

});
