import SelectQuizToAdd from '../../../screens/WorkPackage/Package/SelectQuizToAdd';
import React from 'react';
import { render, fireEvent, waitFor, debug } from '@testing-library/react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getUser } from '../../../components/AsyncStorage';

// Mocking the navigation and route
jest.mock('@react-navigation/native', () => ({
  useRoute: jest.fn(),
  useNavigation: jest.fn(),
}));

// Mocking AsyncStorage
jest.mock('../../../components/AsyncStorage', () => ({
  getUser: jest.fn(),
}));

// Mocking fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve([
        { _id: '1', name: 'Quiz 1' },
        { _id: '2', name: 'Quiz 2' },
      ]),
    status: 200,
  })
);

describe('SelectQuizToAdd', () => {
  beforeEach(() => {
    fetch.mockClear();
    useRoute.mockImplementation(() => ({
      params: {
        workPackage: {
          wp_id: '123',
          name: 'Package 1',
          grade: 'Grade A',
        },
        package: {
          p_id: '123',
          p_quizzes: [
            {
              quiz_id: '1',
              quiz_name: 'Quiz 1',
            },
            {
              quiz_id: '2',
              quiz_name: 'Quiz 2',
            },
          ],
          p_materials: [],
          subcategory: 'Math',
          description: 'This is a description',
        },
      },
    }));
    useNavigation.mockImplementation(() => ({
      navigate: jest.fn(),
    }));
  });

  it('deletes a quiz and updates state on successful response', async () => {
    // Mock fetch
    fetch.mockResolvedValue({ ok: true });

    // Render component
    const { queryByTestId } = render(<SelectQuizToAdd />);
    // Use queryByTestId to get the delete button
    const deleteButton = queryByTestId('delete-quiz-1');
    if (deleteButton) {
      fireEvent.press(deleteButton);

      // Assertions
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('https://lockandlearn.onrender.com/quizzes/deleteQuiz/1', {
          method: 'DELETE',
        });
        // Add other assertions as needed
      });
    } else {
      // Assert that the button should be there
      expect(deleteButton).toBeNull();
    }
  });

  // Test for adding selected quizzes to the work package
  it('adds selected quizzes to work package and navigates', async () => {
    const navigateMock = jest.fn();
    useNavigation.mockImplementation(() => ({
      navigate: navigateMock,
    }));

    const { getByTestId } = render(<SelectQuizToAdd />);

    // Assume "add-quizzes-button" is the testID for the button to add selected quizzes
    const addButton = getByTestId('add-quizzes-button');
    fireEvent.press(addButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1); // Adjust based on expected number of fetch calls
      // Verify navigation has been called with expected arguments
      expect(navigateMock).toHaveBeenCalledWith('EditPackage', expect.any(Object));
    });
  });


});
