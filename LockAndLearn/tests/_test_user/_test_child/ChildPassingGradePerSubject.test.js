import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ChildPassingGradePerSubject from '../../../screens/User/Child/ChildPassingGradePerSubject';
import { Button, TextInput, FlatList } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// Mock the necessary modules
jest.mock('react-native-vector-icons/MaterialIcons', () => 'MaterialIcons');
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));
jest.mock('react-native-modal', () => 'Modal');
jest.mock('../../../components/AsyncStorage', () => ({
    getItem: jest.fn(() => Promise.resolve(JSON.stringify({ _id: 'user123' }))), // Mocked user object
  }));

jest.mock('@react-native-async-storage/async-storage', () => ({
getItem: jest.fn(),
}));


jest.mock('react-native-paper', () => {
return {
    // Mock only the components you use
    Icon: 'Icon',
    Button: 'Button',
    // ... other components as needed ...
};
});
// Mock navigation
const mockNavigation = {
    navigate: jest.fn(),
  };

// Mock fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([]), // Mock response for the API
    status: 200,
  })
);


// Define your test child data
const mockChild = {
  _id: 'child123',
  firstName: 'John',
  lastName: 'Doe',
  grade: '1',
};

const mockRoute = {
  params: {
    child: mockChild,
  },
};


describe('ChildPassingGradePerSubject Screen test', () => {
    beforeEach(() => {
        jest.spyOn(console, 'log').mockImplementation(() => {});
        jest.spyOn(console, 'error').mockImplementation(() => {});
        });
        
    afterEach(() => {
        console.log.mockRestore();
        console.error.mockRestore();
        jest.clearAllMocks();
        });

  it('Renders the screen components correctly', () => {
    const { getByText, getByTestId } = render(
      <ChildPassingGradePerSubject route={mockRoute} />
    );

    // Example: Check if screen renders child's name
    expect(getByText('John Doe')).toBeTruthy();
  });

  it('Updates user subjects and navigates on success', async () => {

    const { getByTestId } = render(
        <ChildPassingGradePerSubject route={mockRoute} navigation={mockNavigation} />
      );
    // You need to simulate the conditions that would trigger `handleUpdateUserSubjectsPassingGrade`.
    // For example, if it's triggered by a button press:
    const saveButton = getByTestId('save-buttons');
    fireEvent.press(saveButton);

    await waitFor(() => {
      // Check if the correct API call is made
      expect(global.fetch).toHaveBeenCalledWith(`http://localhost:4000/child/updateUserSubjectsPassingGrade/child123`, expect.anything());

      // Check if navigation is called after a successful update
      expect(mockNavigation.navigate).toHaveBeenCalledWith('ChildSettings', expect.anything());
    });

    // You may also want to test error handling by mocking a failed API response
  });


});
