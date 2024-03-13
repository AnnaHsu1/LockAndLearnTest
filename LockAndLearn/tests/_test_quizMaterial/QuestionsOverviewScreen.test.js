import { describe, expect, test } from '@jest/globals';
import React from 'react';
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react-native';
import QuestionsOverviewScreen from '../../screens/QuizMaterial/QuestionsOverviewScreen';
import { useNavigation } from '@react-navigation/native';

const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();

jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: jest.fn(),
  };
});

describe('QuestionsOverviewScreen Tests', () => {
  beforeEach(() => {
    fetchMock.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  test('fetches questions and renders them', async () => {
    const mockQuestions = {
      questions: [
        { questionText: 'What is 2+2?' },
        { questionText: 'What is the capital of France?' },
      ]
    };

    fetchMock.mockResponseOnce(JSON.stringify(mockQuestions));

    const { findByText } = render(<QuestionsOverviewScreen route={{ params: { quizId: '123' } }} />);

    expect(await findByText('What is 2+2?')).toBeDefined();
    expect(await findByText('What is the capital of France?')).toBeDefined();
  });

  test('deletes a question when delete button is pressed', async () => {
    const mockQuestions = {
      questions: [
        { questionText: 'What is 2+2?' }
      ]
    };

    const updatedMockQuestions = {
      questions: []
    };

    fetchMock.mockResponseOnce(JSON.stringify(mockQuestions));  // Initial fetch
    fetchMock.mockResponseOnce(JSON.stringify(updatedMockQuestions));  // After deletion

    const { findByTestId } = render(<QuestionsOverviewScreen route={{ params: { quizId: '123' } }} />);
    const deleteButton = await findByTestId('delete-button-x');

    fireEvent.press(deleteButton);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('https://lockandlearn.onrender.com/quizzes/deleteQuestion/123/0', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });
  });
  test('navigates to CreateQuestion screen when Create Question button is pressed', async () => {
    const mockQuestions = {
      questions: [
        { questionText: 'What is 2+2?' }
      ]
    };

    // Initial fetch for rendering questions
    fetchMock.mockResponseOnce(JSON.stringify(mockQuestions));

    // Mocking the navigation function
    const mockNavigate = jest.fn();
    useNavigation.mockReturnValue({
      navigate: mockNavigate
    });

    const { findByText } = render(<QuestionsOverviewScreen route={{ params: { quizId: '123' } }} />);
    const createQuestionButton = await findByText('Add Question');

    fireEvent.press(createQuestionButton);

    expect(mockNavigate).toHaveBeenCalledWith('CreateQuestion', {
      quizId: '123'
    });
});

});
