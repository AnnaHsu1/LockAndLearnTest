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

    fetchMock.mockResponseOnce(JSON.stringify(mockQuizzes));
    fetchMock.mockResponseOnce(JSON.stringify({ message: 'Quiz deleted' }));

    const { findByText, findByTestId } = render(
      <QuizzesOverviewScreen route={{ params: { userId: '123' } }} />
    );
    // const deleteButton = await findByText('X');
    const deleteButton = await findByTestId('delete-button-x');

    fireEvent.press(deleteButton);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('http://localhost:4000/quizzes/deleteQuiz/1', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });
  });
});
