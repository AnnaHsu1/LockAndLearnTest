import { describe, expect, test } from '@jest/globals';
import React from 'react';
import { render, fireEvent, waitFor, act, cleanup } from '@testing-library/react-native';
import QuizzesOverviewScreen from '../screens/QuizMaterial/QuizzesOverviewScreen';
import { useNavigation } from '@react-navigation/native';


const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();

jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: jest.fn(),
  };
});

describe('QuizzesOverviewScreen Tests', () => {
  beforeEach(() => {
    fetchMock.mockClear();
  });
  afterEach(() => {
    cleanup();
  });

  test('fetches quizzes and renders them', async () => {
    const mockQuizzes = [
      { _id: '1', name: 'Quiz 1' },
      { _id: '2', name: 'Quiz 2' },
    ];

    fetchMock.mockResponseOnce(JSON.stringify(mockQuizzes));

    const { getByText } = render(<QuizzesOverviewScreen route={{ params: { workPackageId: '123' } }} />);

    await waitFor(() => {
      expect(getByText('Quiz 1')).toBeDefined();
      expect(getByText('Quiz 2')).toBeDefined();
    });
  });

  test('deletes a quiz when delete button is pressed', async () => {
    const mockQuizzes = [
      { _id: '1', name: 'Quiz 1' },
    ];

    fetchMock.mockResponseOnce(JSON.stringify(mockQuizzes));
    fetchMock.mockResponseOnce(JSON.stringify({ message: 'Quiz deleted' }));

    const { findByText } = render(<QuizzesOverviewScreen route={{ params: { workPackageId: '123' } }} />);
    const deleteButton = await findByText('X');

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
