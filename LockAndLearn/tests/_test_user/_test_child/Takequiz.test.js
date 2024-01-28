import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';
import fetchMock from 'jest-fetch-mock';
import TakeQuiz from '../../../screens/User/Child/TakeQuiz';

// Mock the navigation and fetch
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));
fetchMock.enableMocks();

beforeEach(() => {
  fetch.resetMocks();
});

describe('TakeQuiz Component', () => {
  it('renders correctly', () => {
    const { getByText } = render(<TakeQuiz />);
    expect(getByText('Quizzes')).toBeTruthy();
  });

  it('fetches quizzes successfully', async () => {
    const mockQuizzes = [{ _id: '1', name: 'Quiz 1', questions: [] }];
    fetch.mockResponseOnce(JSON.stringify(mockQuizzes));

    const { getByText } = render(<TakeQuiz />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(getByText('Quiz 1')).toBeTruthy();
  });

  it('navigates to DisplayQuizzScreen on quiz selection', () => {
    const mockQuizzes = [{ _id: '1', name: 'Quiz 1', questions: [] }];
    fetch.mockResponseOnce(JSON.stringify(mockQuizzes));

    const mockNavigate = jest.fn();
    useNavigation.mockReturnValue({ navigate: mockNavigate });

    const { getByText } = render(<TakeQuiz />);
    
    // Wait for quizzes to be fetched and rendered
    waitFor(() => {
      const quizItem = getByText('Quiz 1');
      fireEvent.press(quizItem);
      expect(mockNavigate).toHaveBeenCalledWith('DisplayQuizzScreen', {
        quizId: '1',
        quizLength: 0,
        questionIndex: 0,
      });
    });
  });

  // Additional tests can go here
});

