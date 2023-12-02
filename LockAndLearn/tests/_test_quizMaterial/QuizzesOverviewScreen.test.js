import { describe, expect, test } from '@jest/globals';
import React from 'react';
import { render, fireEvent, waitFor, act, cleanup } from '@testing-library/react-native';
import QuizzesOverviewScreen from '../../screens/QuizMaterial/QuizzesOverviewScreen';
import { useNavigation } from '@react-navigation/native';

const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();

jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: jest.fn(),
  };
});
jest.mock('../../components/AsyncStorage', () => ({
  getUser: jest.fn().mockResolvedValue({ _id: '123' }),
}));

describe('QuizzesOverviewScreen Tests', () => {
  beforeEach(() => {
    fetchMock.mockClear();
  });
  afterEach(() => {
    cleanup();
  });

  it('renders quizzes correctly', async () => {
    const mockQuizzes = [
      { _id: 'quiz1', name: 'Quiz 1' },
      { _id: 'quiz2', name: 'Quiz 2' },
    ];

    fetchMock.mockResponseOnce(JSON.stringify(mockQuizzes));

    const route = { params: { userId: '123' } };
    const { findByText } = render(<QuizzesOverviewScreen route={route} />);

    expect(await findByText('Quiz 1')).toBeDefined();
    expect(await findByText('Quiz 2')).toBeDefined();
  });

  test('deletes a quiz when delete button is pressed', async () => {
    const mockQuizzes = [{ _id: '1', name: 'Quiz 1' }];
  
    fetchMock.mockResponses(
      [JSON.stringify(mockQuizzes), { status: 200 }], // Mock response for initial GET request
      [JSON.stringify({ message: 'Quiz deleted' }), { status: 200 }] // Mock response for DELETE request
    );
  
    const { findByTestId } = render(
      <QuizzesOverviewScreen route={{ params: { userId: '123' } }} />
    );
  
    // Wait for initial quizzes to be rendered
    await waitFor(() => findByTestId('delete-button-x'));
  
    // Press the delete button
    const deleteButton = await findByTestId('delete-button-x');
    fireEvent.press(deleteButton);
  
    // If there's a confirmation step (like a modal), simulate that as well
    const confirmButton = await findByTestId('deleteConfirmationModal');
    fireEvent.press(confirmButton);
  
    // Assert the DELETE fetch call
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:4000/quizzes/deleteQuiz/1',
        expect.objectContaining({
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
    });
  });
  
});
