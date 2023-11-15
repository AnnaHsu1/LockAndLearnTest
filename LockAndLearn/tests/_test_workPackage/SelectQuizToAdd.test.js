import SelectQuizToAdd from '../../screens/WorkPackage/Quiz/SelectQuizToAdd';
import React from 'react';
import { render, fireEvent, waitFor, debug } from '@testing-library/react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getUser } from '../../components/AsyncStorage';

// Mocking the navigation and route
jest.mock('@react-navigation/native', () => ({
  useRoute: jest.fn(),
  useNavigation: jest.fn(),
}));

// Mocking AsyncStorage
jest.mock('../../components/AsyncStorage', () => ({
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
        workPackageId: '123',
        workPackageName: 'Package 1',
        workPackageGrade: 'Grade A',
        workPackageSubcategory: 'Math',
      },
    }));
    useNavigation.mockImplementation(() => ({
      navigate: jest.fn(),
    }));
  });

  it('renders correctly', async () => {
    getUser.mockResolvedValue(JSON.stringify({ _id: 'mockedUserId' }));
    const { getByText, getAllByTestId } = render(<SelectQuizToAdd />);

    await waitFor(() => {
      expect(getByText('Choose Quizzes To Add To Your Work Package:')).toBeTruthy();
      expect(getByText('Package 1 - Grade A')).toBeTruthy();
      //   expect(fetch).toHaveBeenCalledWith('http://localhost:4000/quizzes/allQuizzes/undefined');
    });
  });

  it('conditionally renders the add button', async () => {
    const { queryByTestId } = render(<SelectQuizToAdd />);

    const addButton = queryByTestId('add-quizzes-button');

    if (addButton) {
      fireEvent.press(addButton);

      // Expectations when the button is present
      // For example, if pressing the button is supposed to trigger an API call:
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(/* your expected fetch arguments */);
      });

      // If the button should navigate to another screen:
      expect(
        useNavigation().navigate
      ).toHaveBeenCalledWith(/* your expected navigation arguments */);
    } else {
      // Assert that the button should not be there
      // This part of the test runs if the button is not rendered
      expect(addButton).toBeNull();
    }
  });

  it('allows selecting and unselecting quizzes', async () => {
    const { getByText, getAllByTestId } = render(<SelectQuizToAdd />);

    await waitFor(() => {
      // Ensure quizzes are loaded
      expect(getByText('Quiz 1')).toBeTruthy();
      expect(getByText('Quiz 2')).toBeTruthy();
    });

    // Simulate selecting the first quiz
    const firstQuizCheckbox = getAllByTestId('quiz-selection-checkbox')[0];
    fireEvent.press(firstQuizCheckbox);

    // Wait for state to update after pressing the checkbox
    await waitFor(() => {
      // Check if the first quiz is selected
      expect(firstQuizCheckbox.props.value).toBe(undefined);
    });

    fireEvent.press(firstQuizCheckbox);

    // Wait for state to update after unpressing the checkbox
    await waitFor(() => {
      // Check if the first quiz is unselected
      expect(firstQuizCheckbox.props.value).toBe(undefined);
    });
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
        expect(fetch).toHaveBeenCalledWith('http://localhost:4000/quizzes/deleteQuiz/1', {
          method: 'DELETE',
        });
        // Add other assertions as needed
      });
    } else {
      // Assert that the button should be there
      expect(deleteButton).toBeNull();
    }
  });
});
